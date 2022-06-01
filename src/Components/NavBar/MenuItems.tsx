import Cookies from 'js-cookie';

export const MenuItems = [
    {
        title: 'MyListings',
        url: '#',
        cName: 'nav-links'
    },
    {
        title: 'Profile',
        url: '/users/' + Cookies.get('UserId'),
        cName: 'nav-links'
    },
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
    {
        title: 'Logout',
        url: '/users/logout',
        cName: 'nav-links'
    },
]