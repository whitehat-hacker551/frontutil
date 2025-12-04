import { Routes } from '@angular/router';
import { Home } from './component/shared/home/home';
import { Login } from './component/shared/login/login';
import { RoutedAdminPlist } from './component/blog/routed-admin-plist/routed-admin-plist';
import { RoutedAdminView } from './component/blog/routed-admin-view/routed-admin-view';
import { RoutedUserPlist } from './component/blog/routed-user-plist/routed-user-plist';
import { RoutedUserView } from './component/blog/routed-user-view/routed-user-view';
import { RoutedAdminEdit } from './component/blog/routed-admin-edit/routed-admin-edit';
import { RoutedAdminNew } from './component/blog/routed-admin-new/routed-admin-new';
import { RoutedAdminRemove } from './component/blog/routed-admin-remove/routed-admin-remove';
import { RoutedAdminPlistCalinescu } from './component/calinescu/routed-admin-plist/routed-admin-plist';
import { RoutedAdminViewCalinescu } from './component/calinescu/routed-admin-view/routed-admin-view';
import { RoutedAdminNewCalinescu } from './component/calinescu/routed-admin-new/routed-admin-new';
import { RoutedAdminEditCalinescu } from './component/calinescu/routed-admin-edit/routed-admin-edit';
import { RoutedAdminRemoveCalinescu } from './component/calinescu/routed-admin-remove/routed-admin-remove';
import { RoutedUserPlistCalinescu } from './component/calinescu/routed-user-plist/routed-user-plist';
import { RoutedUserViewCalinescu } from './component/calinescu/routed-user-view/routed-user-view';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'blog', component: RoutedUserPlist },
  { path: 'blog/post/:id', component: RoutedUserView },
  { path: 'blog/plist', component: RoutedAdminPlist },
  { path: 'blog/view/:id', component: RoutedAdminView },
  { path: 'blog/new', component: RoutedAdminNew },
  { path: 'blog/edit/:id', component: RoutedAdminEdit },
  { path: 'blog/remove/:id', component: RoutedAdminRemove },
  { path: 'calinescu', component: RoutedUserPlistCalinescu },
  { path: 'calinescu/item/:id', component: RoutedUserViewCalinescu },
  { path: 'calinescu/plist', component: RoutedAdminPlistCalinescu },
  { path: 'calinescu/view/:id', component: RoutedAdminViewCalinescu },
  { path: 'calinescu/new', component: RoutedAdminNewCalinescu },
  { path: 'calinescu/edit/:id', component: RoutedAdminEditCalinescu },
  { path: 'calinescu/remove/:id', component: RoutedAdminRemoveCalinescu },
];
