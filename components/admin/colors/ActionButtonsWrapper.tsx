import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Modal, Tooltip } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import styles from './colors.module.scss';
import { handleDeleteColor, handleRedirectColors } from './helpers';

type Props = {
  id: string;
};

const ActionButtonsWrapper: React.FC<Props> = ({ id }) => {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const isLoading = useAppSelector((state) => state.colors.loading);
  const dispatch = useAppDispatch();

  const showOrDontModal = () => {
    setVisible(!visible);
  };

  return (
    <>
      <span>
        <Tooltip title="Изменить">
          <Button
            type="default"
            shape="circle"
            icon={<EditOutlined />}
            onClick={handleRedirectColors(id, router)}
          />
        </Tooltip>
      </span>
      <span className={styles.deleteButtonSpan}>
        <Tooltip title="Удалить">
          <Button
            type="default"
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={showOrDontModal}
          />
        </Tooltip>
      </span>
      <Modal
        title="Подтвердите действие."
        visible={visible}
        onOk={handleDeleteColor(id, dispatch, setVisible)}
        confirmLoading={isLoading}
        onCancel={showOrDontModal}
      >
        <p>Вы уверены, что хотите удалить цвет с ID {id}?</p>
      </Modal>
    </>
  );
};

export default ActionButtonsWrapper;