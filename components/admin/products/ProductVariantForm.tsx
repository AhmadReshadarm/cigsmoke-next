import { Button, Form, Input, Select, Switch } from 'antd';
import { Color, Image } from 'swagger/services';
import { ManageProductFields } from './ManageProductsFields.enum';
import styles from './products.module.scss';
import MultipleImageUpload from '../generalComponents/MultipleImageUpload';
import { InsertRowLeftOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import DatabaseImages from 'ui-kit/DatabaseImages';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { clearImageListForVariant } from 'redux/slicers/mutipleImagesSlicer';
import { InputField } from 'common/enums/inputField.enum';
import { capitalizeFirstLetter } from 'common/helpers/capitalizeFirstLetter.helper';
import { TProductParameterState, TProductState } from 'redux/types';
import {
  clearProductsParameters,
  fetchProducusParameters,
} from 'redux/slicers/productParameterSlicer';

const { Option } = Select;

type Props = {
  colors: Color[];
  index: number;
  variantId: number;
  setVariants: any;
  imagesList: Image[];
  isInitialSpecs?: boolean;
  setCharictristicProduct: any;
  editMode: boolean;
  setIsInitialSpecs: any;
  form: any;
};

export const emptyLoading = ['', '', '', '', '', '', '', ''];
const ProductVariant: React.FC<Props> = ({
  colors,
  index,
  variantId,
  setVariants,
  imagesList,
  isInitialSpecs,
  setCharictristicProduct,
  editMode,
  setIsInitialSpecs,
  form,
}) => {
  const { chosenProduct } = useAppSelector<TProductState>(
    (state) => state.products,
  );

  const [isOpen, setOpen] = useState(false);
  const [specs, setSpecs] = useState<any[]>([]);

  const dispatch = useAppDispatch();

  const handleRemove = (variantId: number) => async () => {
    setIsInitialSpecs(true);
    setVariants((prev) => prev.filter((v) => v.id !== variantId));

    dispatch(clearImageListForVariant(variantId));

    setCharictristicProduct((prev) => {
      const newChars = { ...prev };
      delete newChars[variantId];
      return newChars;
    });
  };

  const handleAddSpecs = () => {
    setIsInitialSpecs(true);
    const uniqueId = Math.floor(Math.random() * 5000);
    setSpecs((prev) => [...prev, { id: uniqueId }]);
  };

  const handleRemoveSpecs = (index) => () => {
    setIsInitialSpecs(true);
    setSpecs((prev) => {
      const array = [...prev];
      array.splice(index, 1);

      return array;
    });
  };

  useEffect(() => {
    setCharictristicProduct((prev) => ({
      ...prev,
      [variantId]: specs,
    }));
  }, [specs, variantId]);

  useEffect(() => {
    if (chosenProduct?.productVariants && editMode && !isInitialSpecs) {
      const dbVaranit: any = chosenProduct.productVariants[index];
      setSpecs(
        dbVaranit.parameters.map((param) => {
          return { id: param.id };
        }),
      );
    }
  }, []);

  const KeyInputComp = ({ spec }) => {
    const { parameters, loading } = useAppSelector<TProductParameterState>(
      (state) => state.parameters,
    );

    const [isActiveInput, setIsActiveInput] = useState(false);

    const handleKeyInput = (keyInput: string) => {
      if (keyInput == '') {
        setIsActiveInput(false);
        return;
      }
      const delayDebounceFn = setTimeout(() => {
        setIsActiveInput(true);
        dispatch(fetchProducusParameters({ key: keyInput }));
      }, 1500);

      return () => {
        clearTimeout(delayDebounceFn);
        dispatch(clearProductsParameters());
      };
    };

    const handleSelectedKeyValue = (formId, keyValue) => {
      const newValue = {};
      newValue[formId] = keyValue;
      form.setFieldsValue(newValue);
      setIsActiveInput(false);
      dispatch(clearProductsParameters());
    };

    const handleRejectSuggestion = () => {
      setIsActiveInput(false);
      dispatch(clearProductsParameters());
    };
    // Create sets from params
    const parameterGroups: { [key: string]: Set<string> } = {};
    parameters.forEach((param) => {
      if (!parameterGroups[param.key!]) {
        parameterGroups[param.key!] = new Set();
      }
      parameterGroups[param.key!].add(param.value!);
    });
    // Convert Sets to Arrays
    const formattedGroups: [{ key: string; value: string[] }] | any = [];

    Object.entries(parameterGroups).forEach(([key, values]) => {
      formattedGroups.push({ key, value: Array.from(values) });
    });

    return (
      <div className={styles['product-specs-key-wrapper']}>
        <Form.Item name={`paramId[${spec.id}]`} style={{ display: 'none' }}>
          <Input name={`paramId[${spec.id}]`} />
        </Form.Item>
        <Form.Item
          label="название характеристики"
          name={`${ManageProductFields.KeyValue}[${spec.id}]`}
          required
        >
          <Input
            placeholder="Введите название характеристики"
            style={{ width: '100%' }}
            required={true}
            onChange={(evt) => handleKeyInput(evt.target.value)}
          />
        </Form.Item>
        {isActiveInput && parameters.length !== 0 ? (
          <KeyResultsWrapper>
            <div className="header-wrapper">
              <h4>Выбрать из базы данных</h4>
              <button
                type={'button'}
                className="reject-suggestion-btn"
                onClick={() => handleRejectSuggestion()}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 21 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="1"
                    y1="-1"
                    x2="26.3541"
                    y2="-1"
                    transform="matrix(0.683484 -0.729965 0.681649 0.731679 1.52267 21.0312)"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <line
                    x1="1"
                    y1="-1"
                    x2="26.3044"
                    y2="-1"
                    transform="matrix(0.680786 0.732483 -0.684345 0.729158 0.21875 1.03125)"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>
            <ul>
              {loading
                ? emptyLoading.map((empty, index) => {
                    return <li className="LoaderMask" key={index}></li>;
                  })
                : formattedGroups.map((param, index) => {
                    return (
                      <li
                        tabIndex={0}
                        onClick={() =>
                          handleSelectedKeyValue(
                            `${ManageProductFields.KeyValue}[${spec.id}]`,
                            param.key,
                          )
                        }
                        onKeyDown={(evt) => {
                          if (evt.key == 'Enter') {
                            handleSelectedKeyValue(
                              `${ManageProductFields.KeyValue}[${spec.id}]`,
                              param.key,
                            );
                          }
                        }}
                        key={index}
                      >
                        {param.key}
                      </li>
                    );
                  })}
            </ul>
          </KeyResultsWrapper>
        ) : (
          <></>
        )}
      </div>
    );
  };

  return (
    <div className={styles['product-variant']}>
      <h2 className={styles['product-variant__title']}>
        Вариант № {index + 1}
      </h2>
      <button
        type={'button'}
        className={styles['product-variant__remove']}
        onClick={handleRemove(variantId)}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 21 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="1"
            y1="-1"
            x2="26.3541"
            y2="-1"
            transform="matrix(0.683484 -0.729965 0.681649 0.731679 1.52267 21.0312)"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
          />
          <line
            x1="1"
            y1="-1"
            x2="26.3044"
            y2="-1"
            transform="matrix(0.680786 0.732483 -0.684345 0.729158 0.21875 1.03125)"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
      <Form.Item name={`id[${variantId}]`} style={{ display: 'none' }}>
        <Input name={`id[${variantId}]`} />
      </Form.Item>
      {/* ----------------------PRICE---------------------- */}
      <Form.Item
        label={InputField[capitalizeFirstLetter(ManageProductFields.Price)]}
        name={`${ManageProductFields.Price}[${variantId}]`}
        required
      >
        <Input
          min={1}
          required={true}
          type={'number'}
          placeholder="Введите стоимость продукта"
        />
      </Form.Item>
      {/* ----------------------OLD PRICE---------------------- */}

      <Form.Item
        label={InputField[capitalizeFirstLetter(ManageProductFields.OldPrice)]}
        name={`${ManageProductFields.OldPrice}[${variantId}]`}
      >
        <Input
          // required={true}
          type={'number'}
          placeholder="Введите устаревшую стоимость продукта"
        />
      </Form.Item>
      {/* ----------------------Artical---------------------- */}
      <Form.Item
        label={InputField[capitalizeFirstLetter(ManageProductFields.Artical)]}
        name={`${ManageProductFields.Artical}[${variantId}]`}
        required
      >
        <Input required={true} placeholder="введите Артикул" />
      </Form.Item>
      {/* ----------------------AVAILABLE---------------------- */}
      <Form.Item
        label={InputField[capitalizeFirstLetter(ManageProductFields.Available)]}
        name={`${ManageProductFields.Available}[${variantId}]`}
        valuePropName="checked"
        required={true}
      >
        <Switch />
      </Form.Item>
      {/* ----------------------COLORS---------------------- */}
      <Form.Item
        label="Цвет"
        name={`${ManageProductFields.Color}[${variantId}]`}
        required={true}
      >
        <Select
          allowClear
          style={{ width: '100%' }}
          placeholder={`Выберите цвета`}
        >
          {colors?.map((item) => (
            <Option key={item.id} value={item.id}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '10px',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: item.code,
                    borderRadius: '50%',
                  }}
                ></span>
                <span>{`${item.name}`}</span>
              </div>
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Параметры загрузки изображений"
        name={`${ManageProductFields.Images}[${variantId}]`}
        required
      >
        <MultipleImageUpload
          fileList={imagesList}
          isProduct={true}
          index={variantId}
        />
        <ButtonDevider>
          <Button
            onClick={() => setOpen(true)}
            icon={<InsertRowLeftOutlined />}
          >
            Выбрать из базы данных
          </Button>
        </ButtonDevider>

        {isOpen ? (
          <DatabaseImages
            isProducts={true}
            setOpen={setOpen}
            isOpen={isOpen}
            prodcutVariantIndex={variantId}
          />
        ) : (
          ''
        )}
      </Form.Item>
      <div className={styles['product-variants-specs']}>
        <h2 style={{ marginBottom: '10px' }}>Список характеристик</h2>
        {specs.map((spec, indexParams) => (
          <div style={{ width: '100%' }} key={indexParams}>
            <div className={styles['specs-header-close-btn-wrapper']}>
              <button type={'button'} onClick={handleRemoveSpecs(indexParams)}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 21 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="1"
                    y1="-1"
                    x2="26.3541"
                    y2="-1"
                    transform="matrix(0.683484 -0.729965 0.681649 0.731679 1.52267 21.0312)"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <line
                    x1="1"
                    y1="-1"
                    x2="26.3044"
                    y2="-1"
                    transform="matrix(0.680786 0.732483 -0.684345 0.729158 0.21875 1.03125)"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
              <h2 className={styles['product-variant__title']}>
                Характеристик № {indexParams + 1}
              </h2>
            </div>
            <div className={styles['product-specs-wrapper']}>
              {/*  */}
              <KeyInputComp spec={spec} />
              <div style={{ width: '100%' }}>
                <Form.Item
                  label="данные для характерного поля"
                  name={`${ManageProductFields.Value}[${spec.id}]`}
                  required
                >
                  <Input
                    placeholder="Введите данные для характерного поля"
                    style={{ width: '100%' }}
                    required={true}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        ))}
        <Button type="primary" onClick={handleAddSpecs}>
          Добавить поле характеристики
        </Button>
      </div>
    </div>
  );
};

const ButtonDevider = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 40px;
  padding: 20px 0;
`;

const KeyResultsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 10px;
  background-color: #fff;
  position: absolute;
  top: 70px;
  left: 0;
  z-index: 9;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 2px 6px var(--boxShadowBtn);
  .header-wrapper {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-tems: center;
    .reject-suggestion-btn {
      cursor: pointer;
    }
  }
  ul {
    display: inline-grid;
    grid-template-columns: repeat(5, 1fr);
    grid-column-gap: 10px;
    grid-row-gap: 10px;
    li {
      padding: 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      border: 1px solid #00000045;
      border-radius: 10px;
      &:hover {
        box-shadow: 0 2px 6px var(--boxShadowBtn);
        cursor: pointer;
      }
    }

    @keyframes loading {
      100% {
        transform: translateX(100%);
      }
    }

    .LoaderMask {
      width: 150px;
      height: 50px;
      background: #cccccca3;
      position: relative;
      overflow: hidden;
      &::after {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        transform: translateX(-100px);
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.2),
          transparent
        );
        animation: loading 0.8s infinite;
      }
    }
  }
`;

export default ProductVariant;
