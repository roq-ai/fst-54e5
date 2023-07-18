interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Organization Owner'],
  customerRoles: [],
  tenantRoles: ['Organization Owner', 'Organization Member'],
  tenantName: 'Organization',
  applicationName: 'fst',
  addOns: ['notifications'],
};
