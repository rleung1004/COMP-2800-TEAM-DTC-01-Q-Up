import { useHistory } from 'react-router-dom';

/**
 * Route the customers to the appropriate view according to their type.
 * @param res a server response
 */
export default function routeUsers(res:any) {
    const history = useHistory();
    switch (res.data.userType) {
        case 'manager':
           sessionStorage.setItem(
           'user',
           JSON.stringify({
              token: res.data.generatedToken,
              type: 'manager',
           })
        );
        history.push('/businessDashBoard');
           break;
        case 'employee':
           sessionStorage.setItem(
              'user',
              JSON.stringify({
                 token: res.data.generatedToken,
                 type: 'employee',
              })
           );
           history.push('/teller');
           break;
        case 'display':
           sessionStorage.setItem(
              'user',
              JSON.stringify({
                 token: res.data.generatedToken,
                 type: 'display',
              })
           );
           break;
        case 'booth':
           sessionStorage.setItem(
              'user',
              JSON.stringify({
                 token: res.data.generatedToken,
                 type: 'booth',
              })
           );
           history.push('/boothDashBoard');
           break;
        default:
           sessionStorage.setItem(
              'user',
              JSON.stringify({
                 token: res.data.generatedToken,
                 type: res.data.userType,
                 email: res.data.userEmail,
              })
           );
           history.push('/consumerDashboard');
           break;
     }
} 