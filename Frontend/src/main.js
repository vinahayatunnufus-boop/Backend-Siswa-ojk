import './style.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/siswa';
const studentList = document.querySelector('#student-list');
const tableWrap = document.querySelector('#table-wrap');
const emptyState = document.querySelector('#empty-state');
const emptyTitle = document.querySelector('#empty-title');
const emptyDescription = document.querySelector('#empty-description');
const listCaption = document.querySelector('#list-caption');
const studentCount = document.querySelector('#student-count');
const searchInput = document.querySelector('#search-input');
const notice = document.querySelector('#notice');
const connectionStatus = document.querySelector('#connection-status');
const studentDialog = document.querySelector('#student-dialog');
const studentForm = document.querySelector('#student-form');
const formError = document.querySelector('#form-error');
const dialogTitle = document.querySelector('#dialog-title');
const saveButton = document.querySelector('#save-student');

let students = [];
let editingId = null;

async function request(path = '', options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || `Permintaan gagal (HTTP ${response.status}).`);
  }

  return result;
}

function showNotice(message, type = 'error') {
  notice.textContent = message;
  notice.className = `notice notice-${type}`;
  notice.hidden = !message;
}

function setConnectionStatus(connected) {
  connectionStatus.classList.toggle('is-connected', connected);
  connectionStatus.textContent = connected ? 'API terhubung' : 'API tidak terhubung';
  const dot = document.createElement('span');
  dot.className = 'status-dot';
  dot.setAttribute('aria-hidden', 'true');
  connectionStatus.prepend(dot);
}

function formatDate(value) {
  if (!value) return '—';
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) return '—';
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(
    new Date(year, month - 1, day)
  );
}

function createCell(value, className = '') {
  const cell = document.createElement('td');
  cell.textContent = value || '—';
  if (className) cell.className = className;
  return cell;
}

function createActionButton(label, action, id, className) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = label;
  button.dataset.action = action;
  button.dataset.id = id;
  button.setAttribute('aria-label', `${label} data siswa`);
  return button;
}

function renderStudents() {
  const query = searchInput.value.trim().toLocaleLowerCase('id-ID');
  const filteredStudents = students.filter((student) => {
    const searchable = [
      student.kode_siswa,
      student.nama_siswa,
      student.alamat_siswa,
      student.jurusan_siswa
    ].join(' ').toLocaleLowerCase('id-ID');
    return searchable.includes(query);
  });

  studentList.replaceChildren();
  studentCount.textContent = String(students.length);
  listCaption.textContent = query
    ? `${filteredStudents.length} hasil pencarian`
    : `${students.length} siswa`;

  for (const student of filteredStudents) {
    const row = document.createElement('tr');
    const identityCell = document.createElement('td');
    const identity = document.createElement('div');
    const name = document.createElement('span');
    const code = document.createElement('span');
    identity.className = 'student-identity';
    name.className = 'student-name';
    name.textContent = student.nama_siswa;
    code.className = 'student-code';
    code.textContent = student.kode_siswa;
    identity.append(name, code);
    identityCell.append(identity);

    row.append(
      identityCell,
      createCell(student.jurusan_siswa, 'major-cell'),
      createCell(formatDate(student.tgl_siswa)),
      createCell(student.alamat_siswa, 'address-cell')
    );

    const actions = document.createElement('td');
    actions.className = 'row-actions';
    actions.append(
      createActionButton('Edit', 'edit', student.id, 'text-action'),
      createActionButton('Hapus', 'delete', student.id, 'text-action text-danger')
    );
    row.append(actions);
    studentList.append(row);
  }

  const hasResults = filteredStudents.length > 0;
  tableWrap.hidden = !hasResults;
  emptyState.hidden = hasResults;
  emptyTitle.textContent = students.length === 0
    ? 'Belum ada data siswa'
    : 'Data tidak ditemukan';
  emptyDescription.textContent = students.length === 0
    ? 'Tambahkan data siswa untuk mulai mengisi daftar.'
    : 'Coba gunakan kata kunci pencarian yang lain.';
}

async function loadStudents() {
  try {
    const result = await request();
    if (!Array.isArray(result)) {
      throw new Error('Format data dari server tidak sesuai.');
    }
    students = result;
    setConnectionStatus(true);
    renderStudents();
    showNotice('');
    return true;
  } catch (error) {
    setConnectionStatus(false);
    showNotice(`Tidak bisa memuat data siswa. Pastikan backend aktif di port 3000. ${error.message}`);
    renderStudents();
    return false;
  }
}

function openDialog(student = null) {
  editingId = student?.id ?? null;
  studentForm.reset();
  formError.textContent = '';
  formError.hidden = true;
  dialogTitle.textContent = editingId === null ? 'Tambah siswa' : 'Edit data siswa';
  saveButton.textContent = editingId === null ? 'Simpan data' : 'Simpan perubahan';

  if (student) {
    for (const [key, value] of Object.entries(student)) {
      const field = studentForm.elements.namedItem(key);
      if (field) field.value = value || '';
    }
  }

  studentDialog.showModal();
  studentForm.elements.namedItem('kode_siswa').focus();
}

document.querySelector('#add-student').addEventListener('click', () => openDialog());
document.querySelector('#refresh-list').addEventListener('click', loadStudents);
document.querySelector('#close-dialog').addEventListener('click', () => studentDialog.close());
document.querySelector('#cancel-dialog').addEventListener('click', () => studentDialog.close());
searchInput.addEventListener('input', renderStudents);

studentDialog.addEventListener('click', (event) => {
  if (event.target === studentDialog) studentDialog.close();
});

studentForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  formError.textContent = '';
  formError.hidden = true;

  const formData = new FormData(studentForm);
  const payload = Object.fromEntries(formData.entries());
  payload.tgl_siswa = payload.tgl_siswa || null;
  const path = editingId === null ? '' : `/${encodeURIComponent(editingId)}`;

  saveButton.disabled = true;
  saveButton.textContent = 'Menyimpan...';

  try {
    await request(path, {
      method: editingId === null ? 'POST' : 'PUT',
      body: JSON.stringify(payload)
    });
    studentDialog.close();
    const refreshed = await loadStudents();
    if (refreshed) {
      showNotice(editingId === null ? 'Data siswa berhasil ditambahkan.' : 'Data siswa berhasil diperbarui.', 'success');
    }
  } catch (error) {
    formError.textContent = error.message;
    formError.hidden = false;
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = editingId === null ? 'Simpan data' : 'Simpan perubahan';
  }
});

studentList.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const student = students.find((item) => String(item.id) === button.dataset.id);
  if (!student) return;

  if (button.dataset.action === 'edit') {
    openDialog(student);
    return;
  }

  if (!window.confirm(`Hapus data ${student.nama_siswa}?`)) return;

  try {
    await request(`/${encodeURIComponent(student.id)}`, { method: 'DELETE' });
    const refreshed = await loadStudents();
    if (refreshed) showNotice('Data siswa berhasil dihapus.', 'success');
  } catch (error) {
    showNotice(`Gagal menghapus data siswa. ${error.message}`);
  }
});

loadStudents();
