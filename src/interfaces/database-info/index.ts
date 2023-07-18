import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface DatabaseInfoInterface {
  id?: string;
  host: string;
  database_name: string;
  database_user: string;
  database_password: string;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;

  organization?: OrganizationInterface;
  _count?: {};
}

export interface DatabaseInfoGetQueryInterface extends GetQueryInterface {
  id?: string;
  host?: string;
  database_name?: string;
  database_user?: string;
  database_password?: string;
  organization_id?: string;
}
