import * as yup from 'yup';

export const databaseInfoValidationSchema = yup.object().shape({
  host: yup.string().required(),
  database_name: yup.string().required(),
  database_user: yup.string().required(),
  database_password: yup.string().required(),
  organization_id: yup.string().nullable(),
});
