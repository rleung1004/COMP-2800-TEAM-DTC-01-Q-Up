import React from 'react';
import Footer from 'src/components/static/Footer';
import Header from '../components/static/Header';
import 'bootstrap/dist/css/bootstrap.css';
import '../styles/loginPage.css';
import { Link } from 'react-router-dom';

export default function LoginPage() {
   return (
      <>
         <Header />
         <main>
            <div className='login-form first-element'>
               <form
                  action='https://us-central1-q-up-c2b70.cloudfunctions.net/api/login'
                  method='post'
               >
                  <div className='form-group'>
                     <input
                        type='email'
                        className='form-control'
                        name='email'
                        placeholder='Email'
                        required
                     />
                  </div>
                  <div className='form-group bottom-space'>
                     <input
                        type='password'
                        className='form-control'
                        name='password'
                        placeholder='Password'
                        required
                     />
                  </div>

                  <div className='form-group'>
                     <button
                        type='submit'
                        className='btn white btn-lg btn-block'
                     >
                        Login
                     </button>
                  </div>
               </form>

               <div className='form-group bottom-space'>
                  <button type='button' className='btn btn-lg btn-block'>
                     <Link className='signup-btn' to='/signup'>
                        Signup
                     </Link>
                  </button>
               </div>
               <div className='text-center last-element'>
                  <a href='#'>Forgot user name password?</a>
               </div>
            </div>
         </main>
         <Footer />
      </>
   );
}
