import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    name: {
      type: "varchar",
      length: 100,
    },
    email: {
      type: "varchar",
      length: 150,
      unique: true,
    },
    password: {
      type: "varchar",
      length: 255,
    },
    age: {
      type: "int",
      nullable: true,
    },
    gender: {
      type: "varchar",
      length: 10,
      nullable: true,
    },
    avatar: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    role: {
      type: "varchar",
      length: 20,
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
      type: "one-to-one",
      target: "Doctor",
      inverseSide: "user",
    },
    patient: {
      type: "one-to-one",
      target: "Patient",
      inverseSide: "user",
    },
  },
});
