import { EntitySchema } from "typeorm";

export const Appointment = new EntitySchema({
  name: "Appointment",
  tableName: "appointments",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    date: {
      type: "timestamp",
      nullable: false,
    },
    status: {
      type: "varchar",
      length: 20,
      default: "scheduled",
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },
  relations: {
    doctor: {
      type: "many-to-one",
      target: "Doctor",
      joinColumn: { name: "doctorId" },
      onDelete: "CASCADE",
    },
    patient: {
      type: "many-to-one",
      target: "Patient",
      joinColumn: { name: "patientId" },
      onDelete: "CASCADE",
    },
  },
});
