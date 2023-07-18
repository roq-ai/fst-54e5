import axios from 'axios';
import queryString from 'query-string';
import { DatabaseInfoInterface, DatabaseInfoGetQueryInterface } from 'interfaces/database-info';
import { GetQueryInterface } from '../../interfaces';

export const getDatabaseInfos = async (query?: DatabaseInfoGetQueryInterface) => {
  const response = await axios.get(`/api/database-infos${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createDatabaseInfo = async (databaseInfo: DatabaseInfoInterface) => {
  const response = await axios.post('/api/database-infos', databaseInfo);
  return response.data;
};

export const updateDatabaseInfoById = async (id: string, databaseInfo: DatabaseInfoInterface) => {
  const response = await axios.put(`/api/database-infos/${id}`, databaseInfo);
  return response.data;
};

export const getDatabaseInfoById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/database-infos/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteDatabaseInfoById = async (id: string) => {
  const response = await axios.delete(`/api/database-infos/${id}`);
  return response.data;
};
