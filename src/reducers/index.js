import app from './app';
import github from './github';
import user from './user';
import projects from './projects';

export default {
  ...app,
  ...github,
  ...user,
  ...projects,
};
