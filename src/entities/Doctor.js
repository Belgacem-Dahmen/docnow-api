import { EntitySchema } from "typeorm";

export const Doctor = new EntitySchema({
  name: "Doctor",
  tableName: "doctors",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    userId: {
      type: "int",
      unique: true,
    },
    specialization: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    rating: {
      type: "float",
      default: 0,
      nullable: true,
    },
    casesCount: {
      type: "int",
      default: 0,
    },
    contactNumber: {
      type: "varchar",
      length: 20,
      nullable: true,
    },
    addressText: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    addressCoordinates: {
      type: "json",
      nullable: true, // expects { lat: number, lng: number }
    },
  },
  relations: {
    user: {
      type: "one-to-one",
      target: "User",
      joinColumn: { name: "userId" },
      onDelete: "CASCADE",
    },
    appointments: {
      type: "one-to-many",
      target: "Appointment",
      inverseSide: "doctor",
    }
  },
});
