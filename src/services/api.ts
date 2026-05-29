const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

interface StrapiRequestOptions {
  endpoint: string;
  populate?: string | Record<string, unknown>;
  filters?: Record<string, unknown>;
  sort?: string;
  pagination?: {
    page?: number;
    pageSize?: number;
  };
}

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiSingleResponse<T> {
  data: T;
}

export async function fetchAPI<T>({
  endpoint,
  populate = '*',
  filters,
  sort,
  pagination,
}: StrapiRequestOptions): Promise<StrapiResponse<T>> {
  const params = new URLSearchParams();

  if (populate) {
    if (typeof populate === 'string') {
      params.append('populate', String(populate));
    } else {
      Object.entries(populate).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([subKey, subValue]) => {
            params.append(`populate[${key}][${subKey}]`, String(subValue));
          });
        } else {
          params.append(`populate[${key}]`, String(value));
        }
      });
    }
  }

  if (sort) {
    params.append('sort', sort);
  }

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      params.append(`filters[${key}]`, String(value));
    });
  }

  if (pagination) {
    if (pagination.page) {
      params.append('pagination[page]', String(pagination.page));
    }
    if (pagination.pageSize) {
      params.append('pagination[pageSize]', String(pagination.pageSize));
    }
  }

  const url = `${STRAPI_URL}/api/${endpoint}?${params.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'force-cache',
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function buildPopulateParams(params: URLSearchParams, key: string, value: unknown) {
  if (typeof value === 'object' && value !== null) {
    Object.entries(value).forEach(([subKey, subValue]) => {
      buildPopulateParams(params, `${key}[${subKey}]`, subValue);
    });
  } else {
    params.append(`populate[${key}]`, String(value));
  }
}

export async function fetchSingleAPI<T>({
  endpoint,
  populate = '*',
}: Omit<StrapiRequestOptions, 'filters' | 'sort' | 'pagination'>): Promise<StrapiSingleResponse<T>> {
  const params = new URLSearchParams();

  if (populate) {
    if (typeof populate === 'string') {
      params.append('populate', String(populate));
    } else {
      Object.entries(populate).forEach(([key, value]) => {
        buildPopulateParams(params, key, value);
      });
    }
  }

  const url = `${STRAPI_URL}/api/${endpoint}?${params.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'force-cache',
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
