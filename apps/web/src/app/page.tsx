import { api } from '../api/client';
import CatalogView from '../components/CatalogView';

export default async function CatalogPage() {
  let initialProducts: any[] = [];

  try {
    initialProducts = await api.getProducts();
  } catch (error) {
    console.error('Ошибка предзагрузки продуктов на сервере:', error);
  }

  return <CatalogView initialProducts={initialProducts} />;
}
