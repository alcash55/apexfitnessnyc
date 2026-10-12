import { pageMetadata, HOME_TITLE, HOME_DESCRIPTION } from '@/lib/metadata';
import HomePage from './home';

export const metadata = pageMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: '/',
});

export default HomePage;
