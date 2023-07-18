import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getDatabaseInfoById, updateDatabaseInfoById } from 'apiSdk/database-infos';
import { Error } from 'components/error';
import { databaseInfoValidationSchema } from 'validationSchema/database-infos';
import { DatabaseInfoInterface } from 'interfaces/database-info';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { OrganizationInterface } from 'interfaces/organization';
import { getOrganizations } from 'apiSdk/organizations';

function DatabaseInfoEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<DatabaseInfoInterface>(
    () => (id ? `/database-infos/${id}` : null),
    () => getDatabaseInfoById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: DatabaseInfoInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateDatabaseInfoById(id, values);
      mutate(updated);
      resetForm();
      router.push('/database-infos');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<DatabaseInfoInterface>({
    initialValues: data,
    validationSchema: databaseInfoValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Database Info
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="host" mb="4" isInvalid={!!formik.errors?.host}>
              <FormLabel>Host</FormLabel>
              <Input type="text" name="host" value={formik.values?.host} onChange={formik.handleChange} />
              {formik.errors.host && <FormErrorMessage>{formik.errors?.host}</FormErrorMessage>}
            </FormControl>
            <FormControl id="database_name" mb="4" isInvalid={!!formik.errors?.database_name}>
              <FormLabel>Database Name</FormLabel>
              <Input
                type="text"
                name="database_name"
                value={formik.values?.database_name}
                onChange={formik.handleChange}
              />
              {formik.errors.database_name && <FormErrorMessage>{formik.errors?.database_name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="database_user" mb="4" isInvalid={!!formik.errors?.database_user}>
              <FormLabel>Database User</FormLabel>
              <Input
                type="text"
                name="database_user"
                value={formik.values?.database_user}
                onChange={formik.handleChange}
              />
              {formik.errors.database_user && <FormErrorMessage>{formik.errors?.database_user}</FormErrorMessage>}
            </FormControl>
            <FormControl id="database_password" mb="4" isInvalid={!!formik.errors?.database_password}>
              <FormLabel>Database Password</FormLabel>
              <Input
                type="text"
                name="database_password"
                value={formik.values?.database_password}
                onChange={formik.handleChange}
              />
              {formik.errors.database_password && (
                <FormErrorMessage>{formik.errors?.database_password}</FormErrorMessage>
              )}
            </FormControl>
            <AsyncSelect<OrganizationInterface>
              formik={formik}
              name={'organization_id'}
              label={'Select Organization'}
              placeholder={'Select Organization'}
              fetcher={getOrganizations}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'database_info',
    operation: AccessOperationEnum.UPDATE,
  }),
)(DatabaseInfoEditPage);
