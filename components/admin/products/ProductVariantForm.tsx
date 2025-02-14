import { Button, Form, Input, Select, Switch } from 'antd';
import { Color, Image } from 'swagger/services';
import { ManageProductFields } from './ManageProductsFields.enum';
import styles from './products.module.scss';
import MultipleImageUpload from '../generalComponents/MultipleImageUpload';
import { InsertRowLeftOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import DatabaseImages from 'ui-kit/DatabaseImages';
import { useAppDispatch } from 'redux/hooks';
import { clearImageListForVariant } from 'redux/slicers/mutipleImagesSlicer';
import { InputField } from 'common/enums/inputField.enum';
import { capitalizeFirstLetter } from 'common/helpers/capitalizeFirstLetter.helper';

const { Option } = Select;

type Props = {
  colors: Color[];
  index: number;
  variantId: number;
  // variants: any[];
  setVariants: any;
  imagesList: Image[];
  initialSpecs: any[];
  setCharictristicProduct: any;
  // variant: { id: number };
};
const ProductVariant: React.FC<Props> = ({
  colors,
  index,
  variantId,
  setVariants,
  imagesList,
  initialSpecs,
  setCharictristicProduct,
}) => {
  const [isOpen, setOpen] = useState(false);
  const [specs, setSpecs] = useState<any[]>([]);

  const dispatch = useAppDispatch();

  const handleRemove = (variantId: number) => async () => {
    setVariants((prev) => prev.filter((v) => v.id !== variantId));

    dispatch(clearImageListForVariant(variantId));

    setCharictristicProduct((prev) => {
      const newChars = { ...prev };
      delete newChars[variantId];
      return newChars;
    });
  };

  const handleAddSpecs = () => {
    const uniqueId = Math.floor(Math.random() * 5000);
    setSpecs((prev) => [...prev, { id: uniqueId }]);
  };

  const handleRemoveSpecs = (index) => () => {
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
            <Option key={item.id} value={item.id}>{`${item.name}`}</Option>
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
              <div style={{ width: '100%' }}>
                <Form.Item
                  label="название характеристики"
                  name={`${ManageProductFields.KeyValue}[${spec.id}]`}
                  required
                >
                  <Input
                    placeholder="Введите название характеристики"
                    style={{ width: '100%' }}
                    required={true}
                  />
                </Form.Item>
              </div>

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

export default ProductVariant;
