import React from 'react';
// import { Link } from 'react-router-dom';
import Footer from 'src/components/static/Footer';
import Header from 'src/components/static/Header';
import ConsumerNav from 'src/components/consumerNav';

export default function queueSearchPage() {
    return <>
    <Header Nav={ConsumerNav}/>
        <main>
            queue search page
        </main>
    <Footer/>
    </>;
}