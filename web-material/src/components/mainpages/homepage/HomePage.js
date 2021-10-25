import React from 'react'
import NavBar from '../../navbar/NavBar'
import Header from '../../header/Header'

function HomePage() {
    return (
         <div className="layout">
                
                  <div className="layout-first"><NavBar/></div>
                  <div className="layout-second">
                    <Header/>
                    <h1>HomePage</h1>
                  </div>
        </div>
    )
}

export default HomePage
