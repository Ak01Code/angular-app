import { HttpInterceptorFn } from '@angular/common/http';
import { enviroment } from '../../enviroments/enviroments';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const apiUrl = enviroment.apiUrl;

  const fullUrl = req.url.startsWith('http') ? req.url : `${apiUrl}/${req.url}`;

  const modifiedReq = req.clone({
    url: fullUrl,
    setHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return next(modifiedReq);
};
