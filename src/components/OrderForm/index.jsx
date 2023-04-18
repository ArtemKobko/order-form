import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Slider } from '@mui/material';
import styles from './OrderForm.module.scss';

function OrderForm() {
  const [dishConfig, setDishConfig] = useState('');
  const [errorMessage, setErrorMessage] = useState(false);
  const [successMassage, setSuccessMassage] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    unregister,
    reset,
  } = useForm({
    mode: 'onBlur',
  });

  const makeOrder = async (data) => {
    data.preparation_time = `${data.preparation_time}:00`;
    try {
      await axios.post('https://umzzcc503l.execute-api.us-west-2.amazonaws.com/dishes/', data)
        .then((response) => console.log(response));
      setErrorMessage(false);
      setSuccessMassage(<div className={styles.success}>Your order successfully placed</div>);
      setDishConfig('');
      reset();
      setOrderDone(true);
    } catch (error) {
      console.log(error);
      setSuccessMassage(false);
      setErrorMessage(<div className={styles.error}>Something goes wrong</div>);
    }
  };

  const chooseDish = (e) => {
    const getvalue = e.target.value;
    if (getvalue === '') {
      return setDishConfig(
        <p> </p>,
      );
    }
    if (getvalue === 'pizza') {
      unregister('spiciness_scale');
      unregister('slices_of_bread');
      return setDishConfig(
        <>
          <div>
            <p>
              How many pieces?
            </p>
            <input
              type="number"
              placeholder="4/6/8/10"
              min="4"
              max="10"
              step="2"
              {...register('no_of_slices', {
                required: true,
              })}
            />
            {errors?.no_of_slices && (
            <span
              className={styles.formerror}
            >
              Please fill in this field
            </span>
            )}
          </div>
          <div>
            <p>
              What size??
            </p>
            <input
              type="number"
              placeholder="From 15.0 to 45.5"
              min="15"
              max="45.5"
              step="0.1"
              {...register('diameter', {
                required: true,
              })}
            />
            {errors?.diameter ? (
              <span
                className={styles.formerror}
              >
                Please fill in this field
              </span>
            ) : null }
          </div>
        </>,
      );
    }
    if (getvalue === 'soup') {
      unregister('diameter');
      unregister('no_of_slices');
      unregister('slices_of_bread');
      return setDishConfig(
        <div>
          <p>
            How spicy would you like?
          </p>
          <Slider
            sx={{
              width: '90% ',
              marginLeft: 3,
            }}
            aria-label="Temperature"
            min={1}
            max={10}
            step={1}
            {...register('spiciness_scale', {
              required: true,
            })}
          />
          {errors?.spiciness_scale && (
          <span
            className={styles.formerror}
          >
            Please fill in this field
          </span>
          )}
        </div>
        ,
      );
    }
    if (getvalue === 'sandwich') {
      unregister('diameter');
      unregister('no_of_slices');
      unregister('spiciness_scale');
      return setDishConfig(
        <div>
          <p>
            How many slices of bread??
          </p>
          <input
            autoComplete="off"
            type="number"
            placeholder="1-4"
            min="1"
            max="4"
            step="1"
            {...register('slices_of_bread', {
              required: true,
            })}
          />
          {errors?.slices_of_bread && (
          <span
            className={styles.formerror}
          >
            Please fill in this field
          </span>
          )}
        </div>,
      );
    }
    return null;
  };
  if (!orderDone) {
    return (
      <div>

        <form onSubmit={handleSubmit(makeOrder)} className={styles.OrderForm}>
          <div className={styles.orderConteiner}>
            <h2 className={styles.header}>What do you like today?</h2>
            <input
              {...register('name', {
                required: true,
                minLength: {
                  value: 3,
                  message: 'Name is too short',
                },
              })}
              placeholder="Dish name"
              autoComplete="off"
            />
            {errors?.name && <span className={styles.formerror}>{errors?.name?.message || 'Please fill in this field'}</span>}
            <input
              type="time"
              step="60"
              {...register('preparation_time', {
                required: true,
              })}
            />
            {errors?.preparation_time && (
            <span
              className={styles.formerror}
            >
              Please fill in this field
            </span>
            )}
            <select
              {...register('type', {
                required: true,
              })}
              onChange={chooseDish}
              className={styles.customSelect}
            >
              <option value="">Choose your dish</option>
              <option value="pizza">Pizza</option>
              <option value="soup">Soup</option>
              <option value="sandwich">Sandwich</option>
            </select>
            {errors?.type && <span className={styles.formerror}>Please fill in this field</span>}
            {dishConfig}
            {errorMessage}
            <button type="submit" className={styles.subBtn}>Make an order</button>
          </div>
        </form>
      </div>
    );
  }
  return (
    <div className={styles.orderConteiner}>
      {successMassage}
      <button type="submit" className={styles.subBtn} onClick={() => setOrderDone(false)}>Make a new order</button>
    </div>
  );
}

export default OrderForm;
