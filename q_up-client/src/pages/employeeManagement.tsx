import React from 'react';
// import { Link } from 'react-router-dom';
import Footer from 'src/components/static/Footer';
import Header from 'src/components/static/Header';
import BusinessNav from 'src/components/businessNav';

export default function EmployeeManagementPage() {
    return <>
    <Header Nav={BusinessNav}/>
        <main>
            business dashboard
        </main>
    <Footer/>
    </>;
}