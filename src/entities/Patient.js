import { EntitySchema } from "typeorm";

export const Patient = new EntitySchema({
  name: "Patient",
  tableName: "patients",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    medicalHistory: {
      type: "text",
      nullable: true,
    },
    userId: {
      type: "int",
      unique: true,
    },
  },
  relations: {
    user: {
      type: "one-to-one",
      target: "User",
      joinColumn: { name: "userId" },
      onDelete: "CASCADE",
    },
  },
});