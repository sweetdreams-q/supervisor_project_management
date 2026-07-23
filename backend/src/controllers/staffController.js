const path = require('path');
const { readCSV, writeCSV } = require('../csv/csvHelper');

const staffFilePath = path.join(__dirname, '..', '..', 'data', 'staff.csv');
const staffHeaders = ['id', 'name', 'email', 'department', 'bio'];

function normalizeStaff(staff) {
  return {
    id: String(staff.id || ''),
    name: String(staff.name || '').trim(),
    email: String(staff.email || '').trim(),
    department: String(staff.department || '').trim(),
    bio: String(staff.bio || '').trim(),
  };
}

function createStaffId(staffList) {
  const maxNumericId = staffList.reduce((maxId, staff) => {
    const numericId = Number.parseInt(staff.id, 10);
    return Number.isNaN(numericId) ? maxId : Math.max(maxId, numericId);
  }, 0);

  return String(maxNumericId + 1);
}

async function getAllStaff(req, res) {
  try {
    const staffList = await readCSV(staffFilePath);
    return res.status(200).json({ success: true, data: staffList });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to read staff data', error: error.message });
  }
}

async function getStaffById(req, res) {
  try {
    const staffList = await readCSV(staffFilePath);
    const staff = staffList.find((item) => String(item.id) === String(req.params.id));

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    return res.status(200).json({ success: true, data: staff });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to read staff data', error: error.message });
  }
}

async function createStaff(req, res) {
  try {
    const { name, email, department, bio } = req.body || {};

    if (!name || !email || !department || !bio) {
      return res.status(400).json({
        success: false,
        message: 'name, email, department, and bio are required',
      });
    }

    const staffList = await readCSV(staffFilePath);
    const newStaff = normalizeStaff({
      id: createStaffId(staffList),
      name,
      email,
      department,
      bio,
    });

    staffList.push(newStaff);
    await writeCSV(staffFilePath, staffList, staffHeaders);

    return res.status(201).json({ success: true, message: 'Staff member created', data: newStaff });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create staff member', error: error.message });
  }
}

async function updateStaff(req, res) {
  try {
    const staffList = await readCSV(staffFilePath);
    const staffIndex = staffList.findIndex((item) => String(item.id) === String(req.params.id));

    if (staffIndex === -1) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    const updatedStaff = normalizeStaff({
      ...staffList[staffIndex],
      ...req.body,
      id: staffList[staffIndex].id,
    });

    staffList[staffIndex] = updatedStaff;
    await writeCSV(staffFilePath, staffList, staffHeaders);

    return res.status(200).json({ success: true, message: 'Staff member updated', data: updatedStaff });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update staff member', error: error.message });
  }
}

async function deleteStaff(req, res) {
  try {
    const staffList = await readCSV(staffFilePath);
    const staffIndex = staffList.findIndex((item) => String(item.id) === String(req.params.id));

    if (staffIndex === -1) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    const deletedStaff = staffList.splice(staffIndex, 1)[0];
    await writeCSV(staffFilePath, staffList, staffHeaders);

    return res.status(200).json({ success: true, message: 'Staff member deleted', data: deletedStaff });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete staff member', error: error.message });
  }
}

module.exports = {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
};