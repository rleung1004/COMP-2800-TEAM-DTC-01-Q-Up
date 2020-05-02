import React from 'react';
import Footer from 'src/components/static/Footer';
import Header from '../components/static/Header';
import 'bootstrap/dist/css/bootstrap.css';
import '../styles/signupPage.css';
import { Link } from 'react-router-dom';

export default function LoginPage() {
   return (
      <>
         <Header />
         <main>
            <div className='login-form first-element'>
               <form
                  action='https://us-central1-q-up-c2b70.cloudfunctions.net/api/signup'
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

                  <div className='form-group'>
                     <input
                        type='password'
                        className='form-control'
                        name='password'
                        placeholder='Password'
                        required
                     />
                  </div>

                  <div className='form-group bottom-space'>
                     <input
                        type='password'
                        className='form-control'
                        name='confirmPassword'
                        placeholder='Re-enter Password'
                        required
                     />
                  </div>
                  <div className='radio-class'>
                     <label>
                        <input
                           type='radio'
                           id='business'
                           name='userType'
                           value='business'
                        />
                        I am a manager of a business.
                     </label>
                  </div>
                  <div className='radio-class bottom-space'>
                     <label>
                        <input
                           type='radio'
                           id='user'
                           name='userType'
                           value='user'
                        />
                        I want to queue as a customer.
                     </label>
                  </div>
                  <div className='form-group'>
                     <button
                        type='submit'
                        className='btn white btn-lg btn-block'
                     >
                        Signup
                     </button>
                  </div>
               </form>

               <div className='form-group bottom-space'>
                  <button type='button' className='btn btn-lg btn-block'>
                     Back
                  </button>
               </div>
               <div className='text-center last-element'>
                  Already have an account? <Link to='/login'>Log in</Link>
               </div>
            </div>
         </main>
         <Footer />
      </>
   );
}
