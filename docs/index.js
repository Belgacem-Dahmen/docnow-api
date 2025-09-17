import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load root
const rootDoc = YAML.load(path.join(__dirname, "./swagger.yaml"));

// Load path files
const authPaths = YAML.load(path.join(__dirname, "./paths/auth.yaml"));
const userPaths = YAML.load(path.join(__dirname, "./paths/users.yaml"));
const doctorPaths = YAML.load(path.join(__dirname, "./paths/doctors.yaml"));
const patientPaths = YAML.load(path.join(__dirname, "./paths/patients.yaml"));
const appointmentPaths = YAML.load(path.join(__dirname, "./paths/appointments.yaml"));

// Load schemas
const userSchema = YAML.load(path.join(__dirname, "./schemas/user.yaml"));
const doctorSchema = YAML.load(path.join(__dirname, "./schemas/doctor.yaml"));
const patientSchema = YAML.load(path.join(__dirname, "./schemas/patient.yaml"));
const appointmentSchema = YAML.load(path.join(__dirname, "./schemas/appointments.yaml"));
const authSchema = YAML.load(path.join(__dirname, "./schemas/auth.yaml"));

// Load security
const security = YAML.load(path.join(__dirname, "./security.yaml"));

// Merge paths
rootDoc.paths = {
  ...rootDoc.paths,
  ...authPaths,
  ...userPaths,
  ...doctorPaths,
  ...patientPaths,
  ...appointmentPaths,
};

// Merge schemas
rootDoc.components = rootDoc.components || {};
rootDoc.components.schemas = {
  ...rootDoc.components.schemas,
  ...userSchema,
  ...doctorSchema,
  ...patientSchema,
  ...appointmentSchema,
  ...authSchema,
};

// Merge security schemes
rootDoc.components.securitySchemes = {
  ...rootDoc.components.securitySchemes,
  ...security.components.securitySchemes,
};

export default rootDoc;
