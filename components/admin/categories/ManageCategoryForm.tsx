import Button from 'antd/lib/button';
import Spin from 'antd/lib/spin';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import InsertRowLeftOutlined from '@ant-design/icons/InsertRowLeftOutlined';
import TextArea from 'antd/lib/input/TextArea';
import { navigateTo } from 'common/helpers/navigateTo.helper';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import {
  clearImageList,
  setDefaultSingleImageList,
} from 'redux/slicers/imagesSlicer';
import { Page } from 'routes/constants';
import { Category } from 'swagger/services';
import FormItem from '../generalComponents/FormItem';
import ImageUpload from '../generalComponents/ImageUpload';
import styles from './categories.module.scss';
import { handleFormSubmit } from './helpers';
import { ManageCategoryFields } from './ManageCategoryFields.enum';
import DatabaseImages from 'ui-kit/DatabaseImages';
import styled from 'styled-components';

const { Option } = Select;

type Props = {
  categories: Category[];
  category?: Category;
  title: string;
  isLoading: boolean;
  isSaveLoading: boolean;
  editMode: boolean;
};

const ManageCategoryForm = ({
  title,
  categories,
  category,
  isLoading,
  isSaveLoading,
  editMode,
}: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [form] = Form.useForm();
  const imageList = useAppSelector((state) => state.images.imageList);
  const initialValues = {
    name: category?.name,
    desc: category?.desc,
    url: category?.url,
    image: category?.image,
    parent: category?.parent?.id?.toString(),
  };

  useEffect(() => {
    dispatch(clearImageList());
  }, []);

  useEffect(() => {
    if (category?.image) {
      dispatch(
        setDefaultSingleImageList({
          name: category.image,
          url: `/api/images/${category?.image}`,
        }),
      );
    }
  }, [category]);

  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <div className={styles.createCategoryHeader}>
        <h1 className={styles.createCategoryHeader__title}>{title}</h1>
      </div>
      {(isLoading || !category) && editMode ? (
        <Spin className={styles.spinner} size="large" />
      ) : (
        <Form
          layout="vertical"
          onFinish={handleFormSubmit(router, dispatch, imageList)}
          form={form}
          initialValues={initialValues}
          requiredMark={true}
          className={styles.createCategoryForm}
        >
          <FormItem
            option={ManageCategoryFields.Name}
            children={
              <Input required={true} placeholder="Введите имя категории" />
            }
          />
          <FormItem
            option={ManageCategoryFields.Desc}
            children={
              <TextArea
                required={true}
                rows={4}
                placeholder="Краткое описание"
              />
            }
          />
          <FormItem
            option={ManageCategoryFields.Url}
            children={
              <Input
                required={true}
                placeholder="Введите URL категории"
                disabled={editMode}
              />
            }
          />
          <FormItem
            option={ManageCategoryFields.Image}
            children={
              <>
                <ImageUpload fileList={imageList} />
                <label style={{ color: 'red' }} htmlFor="uploadBtn">
                  Размер изображения должен быть 820 x 1024 пикселей.
                </label>
                <ButtonDevider>
                  {imageList.length < 1 && (
                    <Button
                      onClick={() => setOpen(true)}
                      icon={<InsertRowLeftOutlined />}
                    >
                      Выбрать из базы данных
                    </Button>
                  )}
                </ButtonDevider>

                {isOpen ? (
                  <DatabaseImages
                    isProducts={false}
                    setOpen={setOpen}
                    isOpen={isOpen}
                  />
                ) : (
                  ''
                )}
              </>
            }
          />
          <Form.Item
            name={ManageCategoryFields.Parent}
            label="Выберите родительскую категорию"
          >
            <Select defaultValue="Не выбрано" disabled={editMode}>
              <Option value="">Не выбрано</Option>
              {categories?.map((category) => (
                <Option
                  key={`category-form-${category.id}`}
                  value={category.id?.toString()}
                >
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item className={styles.createCategoryForm__buttonsStack}>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.createCategoryForm__buttonsStack__submitButton}
              loading={isSaveLoading}
            >
              {category ? 'Сохранить' : 'Создать'}
            </Button>
            <Button
              type="primary"
              onClick={navigateTo(router, Page.ADMIN_CATEGORIES)}
            >
              Вернуться назад
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
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

export default ManageCategoryForm;
