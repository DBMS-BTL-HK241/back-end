const { runQuery } = require('../config/neo4j');
const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');

function createAppointment(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const statuses = ['Scheduled', 'Cancelled', 'Completed'];

async function createAppointments() {
    const patients = await runQuery('MATCH (p:Patient) RETURN p.PatientID');
    const doctors = await runQuery('MATCH (d:Doctor) RETURN d.DoctorID');
    const clinics = await runQuery('MATCH (c:Clinic) RETURN c.ClinicID');

    // Giải quyết dữ liệu từ kết quả truy vấn
    const patientIDs = patients.records.map(record => record.get('p.PatientID'));
    const doctorIDs = doctors.records.map(record => record.get('d.DoctorID'));
    const clinicIDs = clinics.records.map(record => record.get('c.ClinicID'));

    const appointments = [];
    for (let i = 0; i < 2000; i++) {
        const appointmentID = uuidv4();
        const patient = patientIDs[Math.floor(Math.random() * patientIDs.length)];  // Chọn ngẫu nhiên một bệnh nhân
        const doctor = doctorIDs[Math.floor(Math.random() * doctorIDs.length)];      // Chọn ngẫu nhiên một bác sĩ
        const clinic = clinicIDs[Math.floor(Math.random() * clinicIDs.length)];      // Chọn ngẫu nhiên một phòng khám
        const appointmentDate = createAppointment('2023-01-01', '2024-12-31');
        const status = statuses[Math.floor(Math.random() * statuses.length)];        // Chọn ngẫu nhiên trạng thái

        appointments.push({
            AppointmentID: appointmentID,
            PatientID: patient,
            DoctorID: doctor,
            ClinicID: clinic,
            AppointmentDate: appointmentDate.toISOString(),
            Status: status
        });
    }

    for (const appointment of appointments) {
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
        await runQuery(query, appointment);
    }
}

module.exports = createAppointments;
