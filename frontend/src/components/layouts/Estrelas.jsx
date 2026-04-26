import React, { useState } from 'react';
import styles from './Estrelas.module.css';

const Estrelas = () => {

  return (
    <div className={styles.rating}>
      <input type="radio" name='Avaliacao'/>
      <input type="radio" name='Avaliacao'/>
      <input type="radio" name='Avaliacao'/>
      <input type="radio" name='Avaliacao'/>
      <input type="radio" name='Avaliacao'/>
      <input type="radio" name='Avaliacao'/>
      <input type="radio" name='Avaliacao'/>
      <input type="radio" name='Avaliacao'/>
      <input type="radio" name='Avaliacao'/>
      <input type="radio" name='Avaliacao'/>
    </div>
  );
};

export default Estrelas;
