const { runQuery } = require('../config/neo4j');
const { v4: uuidv4 } = require('uuid');

// Hàm lấy tất cả lịch hẹn kèm thông tin liên quan
const getAllAppointments = async () => {
    const query = `
    MATCH (p:Patient)-[:BOOKED]->(a:Appointment)<-[:ASSIGNED]-(d:Doctor),
          (c:Clinic)-[:HOSTED]->(a)
    RETURN a.AppointmentID AS AppointmentID,
           p.Name AS PatientName,
           d.Name AS DoctorName,
           c.Name AS ClinicName,
           p.PatientID AS PatientID,
           d.DoctorID AS DoctorID,
           c.ClinicID AS ClinicID,
           a.AppointmentDate AS AppointmentDate,
           a.Status AS Status
`;
    const result = await runQuery(query);

    return result.records.map((record) => {
        return {
            AppointmentID: record.get('AppointmentID'),
            PatientName: record.get('PatientName'),
            DoctorName: record.get('DoctorName'),
            ClinicName: record.get('ClinicName'),
            PatientID: record.get('PatientID'),
            DoctorID: record.get('DoctorID'),
            ClinicID: record.get('ClinicID'),
            AppointmentDate: record.get('AppointmentDate'),
            Status: record.get('Status'),
        };
    });
};

// Hàm lấy lịch hẹn theo ID kèm thông tin liên quan
const getAppointmentById = async (id) => {
    const query = `
        MATCH (p:Patient)-[:BOOKED]->(a:Appointment {AppointmentID: $id})<-[:ASSIGNED]-(d:Doctor),
              (c:Clinic)-[:HOSTED]->(a)
        RETURN a AS appointment, 
               p AS patient, 
               d AS doctor, 
               c AS clinic
    `;
    const result = await runQuery(query, { id: parseInt(id) });

    if (result.records.length > 0) {
        const record = result.records[0];
        return {
            appointment: record.get('appointment').properties,
            patient: record.get('patient').properties,
            doctor: record.get('doctor').properties,
            clinic: record.get('clinic').properties,
        };
    }
    return null;
};

// Hàm tạo lịch hẹn với quan hệ liên kết
const createAppointment = async (data) => {
    const newAppointment = {
        AppointmentID: uuidv4(),
        ...data,
    };
    const query = `
        MATCH (p:Patient {PatientID: $PatientID}),
              (d:Doctor {DoctorID: $DoctorID}),
              (c:Clinic {ClinicID: $ClinicID})
        CREATE (a:Appointment {
            AppointmentID: $AppointmentID,
            AppointmentDate: $AppointmentDate,
            Status: $Status
        })
        MERGE (p)-[:BOOKED]->(a)
        MERGE (d)-[:ASSIGNED]->(a)
        MERGE (c)-[:HOSTED]->(a)
        RETURN a
    `;
    const result = await runQuery(query, newAppointment);
    return result.records[0].get('a').properties;
};

// Hàm cập nhật lịch hẹn
const updateAppointment = async (id, data) => {
    const query = `
        MATCH (a:Appointment {AppointmentID: $id})
        SET a += $data
        RETURN a
    `;
    const result = await runQuery(query, { id: parseInt(id), data: data });
    if (result.records.length > 0) {
        return result.records[0].get('a').properties;
    }
    return null;
};

// Hàm xóa lịch hẹn
const deleteAppointment = async (id) => {
    const query = `
        MATCH (a:Appointment {AppointmentID: $id})
        DETACH DELETE a
        RETURN "Appointment deleted successfully"
    `;
    const result = await runQuery(query, { id: parseInt(id) });
    return result.records.length > 0 ? { message: 'Appointment deleted successfully' } : null;
};

// statistics
const statisticsMonthlyAppointments = async (id) => {
    const query = `
        MATCH (a:Appointment)
        WITH a, date(datetime(a.AppointmentDate)) AS appointmentDate
        RETURN 
            appointmentDate.year AS year,
            appointmentDate.month AS month,
            SUM(CASE WHEN a.Status = "Completed" THEN 1 ELSE 0 END) AS totalCompleted,
            SUM(CASE WHEN a.Status = "Cancelled" THEN 1 ELSE 0 END) AS totalCancelled
        ORDER BY year, month
  `;

    const result = await runQuery(query);

    return result.records.map((record) => ({
        year: record.get('year').toNumber(),
        month: record.get('month').toNumber(),
        totalCompleted: record.get('totalCompleted').toNumber(),
        totalCancelled: record.get('totalCancelled').toNumber(),
    }));
};

const checkUpcomingAppointments = async () => {
    const query = `
        MATCH (p:Patient)-[:BOOKED]->(a:Appointment)<-[:ASSIGNED]-(d:Doctor),
            (c:Clinic)-[:HOSTED]->(a)
        WHERE a.Status <> 'Cancelled' AND date(datetime(a.AppointmentDate)) = date(datetime()) + duration({days: 1})
        RETURN a.AppointmentID AS AppointmentID,
            p.Name AS PatientName,
            d.Name AS DoctorName,
            c.Name AS ClinicName,
            a.AppointmentDate AS AppointmentDate,
            a.Status AS Status,
            p.EMAIL AS EMAIL

    `;

    const result = await runQuery(query);

    return result.records.map((record) => {
        return {
            AppointmentID: record.get('AppointmentID'),
            PatientName: record.get('PatientName'),
            DoctorName: record.get('DoctorName'),
            ClinicName: record.get('ClinicName'),
            AppointmentDate: record.get('AppointmentDate'),
            Status: record.get('Status'),
            EMAIL: record.get('EMAIL'),
        };
    });
};

module.exports = {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    statisticsMonthlyAppointments,
    checkUpcomingAppointments,
};
