const mapping: Record<string, string> = {
  'database-infos': 'database_info',
  members: 'member',
  organizations: 'organization',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
