import InfoDropdown from './DropDownsParrent';
import { useAppSelector } from 'redux/hooks';
import { TProductInfoState } from 'redux/types';
import Link from 'next/link';
import InfoDropdownReturn from './DropDownsParrentReturn';
import styles from '../../styles/dropDowns.module.css';
import { parameters } from 'swagger/services';
import { MutableRefObject } from 'react';
import {
  isRussian,
  transliterateRussianToEnglish,
} from 'common/helpers/translateRussianToEnglish.helper';
type Props = {
  parameterProducts?: parameters[];
  specsRef: MutableRefObject<any>;
};

const DropDowns: React.FC<Props> = ({ parameterProducts, specsRef }) => {
  const { product, loading }: TProductInfoState = useAppSelector(
    (state) => state.productInfo,
  );

  return (
    <div ref={specsRef} className={styles.InfoContainer}>
      <InfoDropdown title="Описание">
        <p>
          {!loading
            ? product?.desc?.includes('|')
              ? product?.desc
                  ?.split('|')[1]
                  .split(`\n`)
                  .map((text) => (
                    <>
                      {text}
                      <br />
                    </>
                  ))
              : product?.desc?.split(`\n`).map((text) => (
                  <>
                    {text}
                    <br />
                  </>
                ))
            : ''}
        </p>
      </InfoDropdown>
      <InfoDropdown title="Характеристики">
        <div className={styles.SpecsContainer}>
          <ul className={styles.SpecsKeyValueWrapper}>
            {parameterProducts?.map((param) => {
              const suffix = isRussian(param.key)
                ? transliterateRussianToEnglish(param.key).replace(/\s/g, '')
                : param.key!.replace(/\s/g, '');
              return (
                <li
                  className={styles.wrapper_key_vlaue}
                  key={`parameter-product-label-${param.id}`}
                >
                  <span className={styles.key_wrapper}>{param.key}: </span>
                  <Link
                    href={`/catalog?categories=${
                      product?.category?.parent!.url
                    }&subCategories=${
                      product?.category?.url
                    }&parameters_${suffix}=${param.value}`}
                    prefetch={false}
                  >
                    <span title={`Смотреть все с ${param.key}: ${param.value}`}>
                      {param.value}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </InfoDropdown>
      <InfoDropdown title="Подробнее о доставке">
        <h3 className={styles.dilevery_title}>
          КАКОВА СТОИМОСТЬ И ВАРИАНТЫ ДОСТАВКИ?
        </h3>

        <span className={styles.Content}>
          Бесплатная доставка по Москве и в любую транспортную компанию при
          заказе от 70 000 рублей.
        </span>
        <span className={styles.Content}>
          При меньшей сумме заказа возможен самовывоз или платная доставка.
        </span>
        <span className={styles.Content}>
          Стоимость платной доставки определяется после оформления заказа. Наш
          менеджер свяжется с вами, чтобы уточнить адрес доставки и цену.
        </span>
        <h3 className="dilevery_title">ГДЕ НАХОДЯТСЯ НАШИ СКЛАДЫ?</h3>
        <span className={styles.Content}>
          Наши склады находятся в разных районах Москвы. После оформления заказа
          мы свяжемся с вами, чтобы уточнить адрес доставки или самовывоза с
          ближайшего к вам склада.
        </span>
        <span className={styles.Content}>
          По дополнительным вопросам обращаться по номеру телефона:{' '}
          <Link
            title="По дополнительным вопросам обращаться по номеру телефона 8-800-700-17-41"
            href="tel:88007001741"
            prefetch={false}
          >
            <span
              style={{
                whiteSpace: 'nowrap',
              }}
            >
              8-800-700-17-41
            </span>
          </Link>
          .
        </span>
        <span className={styles.Content}>
          Дополнительная скидка рассчитывается индивидуально и зависит от
          количества заказанного товара.
        </span>
      </InfoDropdown>
      <InfoDropdownReturn
        title="Политика возврата товаров в WULUXE (info@wuluxe.ru, 8-800-700-17-41)"
        borderBottom="none"
      >
        <span className={styles.Content}>
          WULUXE стремится обеспечить своих клиентов высококачественной
          продукцией и безупречным сервисом. Мы понимаем, что иногда может
          возникнуть необходимость вернуть товар. Данная политика возврата
          товаров поможет вам легко и быстро осуществить возврат.
        </span>
        <h3>Право на возврат товара надлежащего качества</h3>
        <span className={styles.Content}>
          В соответствии с Законом РФ "О защите прав потребителей" (статья 26.1)
          вы имеете право вернуть товар надлежащего качества в течение 7 дней с
          момента его получения при соблюдении следующих условий:
        </span>
        <ul className={styles.ListsDots}>
          <li>Сохранены потребительские свойства товара.</li>
          <li>
            Сохранен товарный вид, включая все заводские упаковки, ярлыки и
            бирки.
          </li>
          <li>
            Имеются документы, подтверждающие покупку товара (чек, товарная
            накладная).
          </li>
        </ul>
        <h3>
          Возврат товара надлежащего качества осуществляется за счет покупателя.
        </h3>
        <h3>Товары, не подлежащие возврату надлежащего качества</h3>
        <span className={styles.Content}>
          Согласно Постановлению Правительства РФ от 31.12.2020 N 2463, не
          подлежат возврату товары надлежащего качества, такие как:
        </span>
        <ul className={styles.ListsDots}>
          <li>
            Товары для профилактики и лечения заболеваний в домашних условиях.
          </li>
          <li>Предметы личной гигиены.</li>
          <li>Парфюмерно-косметические товары.</li>
          <li>Текстильные товары (отрезные ткани).</li>
          <li>
            Швейные и трикотажные изделия (белье, чулочно-носочные изделия).
          </li>
          <li>
            Изделия и материалы, контактирующие с пищевыми продуктами (посуда,
            столовые приборы, емкости для хранения продуктов).
          </li>
          <li>Товары бытовой химии.</li>
          <li>Ювелирные изделия и изделия из драгоценных металлов.</li>
          <li>Автомобили и мототовары.</li>
          <li>
            Технически сложные товары бытового назначения на гарантии не менее 1
            года.
          </li>
          <li>Животные и растения.</li>
          <li>Непериодические издания (книги, брошюры).</li>
        </ul>
        <h3>Возврат товара ненадлежащего качества</h3>
        <span className={styles.Content}>
          В случае обнаружения товара ненадлежащего качества, вы, в соответствии
          со статьей 18 ФЗ "О защите прав потребителей", вправе требовать от
          продавца:
        </span>
        <ul className={styles.ListsDots}>
          <li>Замены на товар аналогичной марки (модели).</li>
          <li>
            Замены на такой же товар другой марки (модели) с перерасчетом
            стоимости.
          </li>
          <li>Уменьшения покупной цены товара, соразмерно его недостаткам.</li>
          <li>
            Возврата полной стоимости товара и возмещения расходов на его
            доставку.
          </li>
          <li>
            Безвозмездного устранения недостатков товара или возмещения расходов
            на их устранение.
          </li>
        </ul>
        <h3>Как оформить возврат</h3>
        <span className={styles.Content}>
          Для оформления возврата товара, пожалуйста,свяжитесь с нашей службой
          поддержки клиентов по электронной почте info@wuluxe.ru или по телефону
          <p style={{ whiteSpace: 'nowrap' }}>8-800-700-17-41.</p>
        </span>

        <h3>В своем обращении укажите:</h3>
        <ul className={styles.ListsDots}>
          <li>Номер вашего заказа.</li>
          <li>Причину возврата.</li>
          <li>Информацию о товаре, который вы хотите вернуть.</li>
        </ul>
        <h3>
          После получения вашего запроса наш менеджер свяжется с вами для
          уточнения деталей и предоставит дальнейшие инструкции.
        </h3>
        <h3>Обратите внимание:</h3>
        <ul className={styles.ListsDots}>
          <li>
            Возврат товара осуществляется по адресу, который будет предоставлен
            менеджером службы поддержки клиентов.
          </li>
          <li>
            Товар должен быть возвращен в полной комплектации, в оригинальной
            упаковке, с сохранением всех этикеток и ярлыков.
          </li>
          <li>
            Возврат денежных средств за товар надлежащего качества
            осуществляется в течение 14 дней с момента получения товара на
            складе WULUXE.
          </li>
          <li>
            Возврат денежных средств за товар ненадлежащего качества
            осуществляется в течение 14 дней с момента предъявления
            соответствующего требования.
          </li>
        </ul>
        <h3>
          Мы надеемся, что данная информация поможет вам легко оформить возврат.
          Если у вас возникнут какие-либо вопросы, пожалуйста, не стесняйтесь
          обращаться к нашей службе поддержки клиентов.
        </h3>
      </InfoDropdownReturn>
    </div>
  );
};

export default DropDowns;
