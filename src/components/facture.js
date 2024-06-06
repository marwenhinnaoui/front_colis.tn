import React from 'react';
import "./styles/facture.css";

const Facture = () => {
    return (
        <div className="factureContainer">
            <header className="factureHeader">
                <h1>FACTURE</h1>
                <address className="factureAddress">
                    <p>Colis.tn</p>
                    <p>50 Rue Najeh</p>
                    <p>Tunis</p>
                    <p>+29478319</p>
                </address>
            </header>
            <body className="factureBody">
                <article className="factureArticle">
                    <address className="factureDetailAddress">
                        <p>Détail Facture</p>
                    </address>
                    <table className="factureFirstTable">
                        <tr>
                            <th><span>JOUR DE DEPART</span></th>
                            <td><span>January 1, 2012</span></td>
                        </tr>
                        <tr>
                            <th><span>DESTINATION GOUVERNANT</span></th>
                            <td><span id="prefix">Bizerte</span></td>
                        </tr>
                        <tr>
                            <th><span>VILLE DE DESTENAIRE</span></th>
                            <td><span id="prefix">Menzel</span></td>
                        </tr>
                        <tr>
                            <th><span>ADRESSE DE DESTENAIRE</span></th>
                            <td><span id="prefix">Rue senegal cité najeh 45</span></td>
                        </tr>
                        <tr>
                            <th><span>CODE POSTAL</span></th>
                            <td><span id="prefix">7050</span></td>
                        </tr>
                    </table>
                    <table className="factureSecondTable">
                        <thead>
                            <tr>
                                <th><span>MATRICULE</span></th>
                                <th><span>PRIX</span></th>
                                <th><span>POIDS</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <a className="cut">-</a>
                                    <span>COLISktawprjwpk</span>
                                </td>
                                <td><span>150.00 tnd</span></td>
                                <td><span>4 kg</span></td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="factureThirdTable">
                        <tr>
                            <th><span>NOM DE DESTENAIRE</span></th>
                            <td><span>Marwen Hinaoui</span></td>
                        </tr>
                        <tr>
                            <th><span>NUMERO DE DESTENAIRE</span></th>
                            <td><span>2887588</span></td>
                        </tr>
                    </table>
                </article>

            </body>
        </div>
    );
}

export default Facture;
