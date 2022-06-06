import Cookies from 'js-cookie';

export const LoggedOutMenuItems = [
    {
        title: 'Register',
        url: '/users/register',
        cName: 'nav-links'
    },
    {
        title: 'Login',
        url: '/users/login',
        cName: 'nav-links'
    },
]

export const LoggedInMenuItems = [
    {
        title: 'Manage',
        url: '/auctions/myauctions',
        cName: 'nav-links'
    },
    {
        title: 'Profile',
        url: '/users/' + Cookies.get('UserId'),
        cName: 'nav-links'
    },
    {
        title: 'Logout',
        url: '/users/logout',
        cName: 'nav-links'
    },
]