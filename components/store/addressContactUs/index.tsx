import styled from 'styled-components';
import color from '../lib/ui.colors';
import { devices } from 'components/store/lib/Devices';
import Link from 'next/link';
import { useCopyToClipboard } from './helpers';
import { useEffect } from 'react';
import { openSuccessNotification } from 'common/helpers/openSuccessNotidication.helper';
import {
  LocationPointerSVG,
  MailSVG,
  PhoneSVG,
  WatchSVG,
} from '../storeLayout/utils/headerIcons/SVGIconsFooter';

const MapContainer = () => {
  const [copiedText, setCopiedText, copy] = useCopyToClipboard();
  useEffect(() => {
    if (copiedText) openSuccessNotification('Скопировано в буфер обмена');
  }, [copiedText]);
  return (
    <>
      <MapContianer>
        <iframe
          src="https://yandex.ru/map-widget/v1/?z=12&ol=biz&oid=81234735012"
          width="100%"
          height="800"
          frameBorder="0"
        ></iframe>
      </MapContianer>
      <MapAndAddressWrapper>
        <div className="address-container">
          <ContactsHeaderWrapper>
            <h2>WULUXE - Всё для дома</h2>
          </ContactsHeaderWrapper>
          <ContactContentWrapper>
            <div className="first-column">
              <div className="first-column-content-wrapper">
                <LocationPointerSVG />
                <span
                  className="address-copied"
                  onClick={() => {
                    copy();
                    setTimeout(() => {
                      setCopiedText(false);
                    }, 1000);
                  }}
                  onTouchStart={() => {
                    copy();
                    setTimeout(() => {
                      setCopiedText(false);
                    }, 1000);
                  }}
                  title="Нажмите, чтобы скопировать адрес"
                >
                  г. Москва, Каширское шоссе
                </span>
              </div>
              <div className="first-column-content-wrapper">
                <WatchSVG />
                <span>Пн-Все 10.00-21.00</span>
              </div>
              <div className="first-column-content-wrapper">
                <MailSVG />
                <span>
                  <Link
                    target="_blank"
                    href="mailto:info@wuluxe.ru"
                    title="отправьте письмо по адресу info@wuluxe.ru"
                  >
                    info@wuluxe.ru
                  </Link>
                </span>
              </div>
              <div className="first-column-content-wrapper">
                <PhoneSVG />
                <div className="phone-number-wrapper">
                  <Link href="tel:88007001741">
                    <span title="позвонить 8-800-700-17-41">
                      8-800-700-17-41
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </ContactContentWrapper>
        </div>
      </MapAndAddressWrapper>
    </>
  );
};

const MapAndAddressWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  .address-container {
    width: 500px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 30px;
    z-index: 99;
    background-color: ${color.textPrimary};
    box-shadow: 0px 5px 10px 0px ${color.boxShadowBtn};
    border-radius: 40px;
    padding: 30px;
    margin-top: -60px;
  }
  @media ${devices.tabletL} {
    align-items: center;
    .address-container {
      width: 100%;
      margin-top: 0;
    }
  }
  @media ${devices.tabletS} {
    align-items: center;
    .address-container {
      width: 100%;
      margin-top: 0;
    }
  }
  @media ${devices.mobileL} {
    align-items: center;
    .address-container {
      width: 100%;
      margin-top: 0;
    }
  }
  @media ${devices.mobileM} {
    align-items: center;
    .address-container {
      width: 100%;
      margin-top: 0;
    }
  }
  @media ${devices.mobileS} {
    align-items: center;
    .address-container {
      width: 100%;
      margin-top: 0;
    }
  }
`;

const ContactsHeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 20px 0;
  h2 {
    width: 100%;
    line-height: 2rem;
  }

  @media ${devices.laptopS} {
    h2 {
      width: 100%;
      font-size: 1.2rem;
    }
  }
  @media ${devices.tabletL} {
    h2 {
      width: 100%;
      font-size: 1.2rem;
    }
  }
  @media ${devices.tabletS} {
    h2 {
      width: 100%;
      font-size: 1.2rem;
    }
  }
  @media ${devices.mobileL} {
    h2 {
      width: 100%;
      font-size: 1.2rem;
    }
  }
  @media ${devices.mobileM} {
    h2 {
      width: 100%;
      font-size: 1.2rem;
    }
  }
  @media ${devices.mobileS} {
    h2 {
      width: 100%;
      font-size: 1.2rem;
    }
  }
`;

const ContactContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 90px;
  .first-column {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 20px;
    width: 100%;
    .first-column-content-wrapper {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      gap: 15px;
      .address-copied {
        cursor: pointer;
      }
    }
    .first-column-last-content {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      gap: 20px;
    }
  }

  .second-column {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 20px;
    .second-column-content-wrapper {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      gap: 15px;
      .phone-number-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 15px;
      }
    }
    .second-column-last-content {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding-top: 40px;
      .goto-contact-page-btn {
        width: 200px;
        height: 40px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-radius: 3px;
        background-color: ${color.btnSecondery};
        cursor: pointer;
        transition: 300ms;

        &:hover {
          background-color: ${color.btnPrimary};
          color: ${color.textPrimary};
          transform: scale(1.02);
        }
        &:active {
          transform: scale(1);
        }
        span {
          font-family: ver(--font-Jost);
          font-size: 1rem;
        }
      }
    }
  }
  @media ${devices.laptopS} {
    padding: 0;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 30px;
    .first-column {
      width: 100%;
    }
    .second-column {
      width: 100%;
    }
  }
  @media ${devices.tabletL} {
    padding: 0;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 30px;
    .first-column {
      width: 100%;
    }
    .second-column {
      width: 100%;
    }
  }
  @media ${devices.tabletS} {
    padding: 0;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 30px;
    .first-column {
      width: 100%;
    }
    .second-column {
      width: 100%;
    }
  }
  @media ${devices.mobileL} {
    padding: 0;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 30px;
    .first-column {
      width: 100%;
    }
    .second-column {
      width: 100%;
    }
  }
  @media ${devices.mobileM} {
    padding: 0;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 30px;
    .first-column {
      width: 100%;
    }
    .second-column {
      width: 100%;
    }
  }

  @media ${devices.mobileS} {
    padding: 0;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 30px;
    .first-column {
      width: 100%;
    }
    .second-column {
      width: 100%;
    }
  }
`;

const MapContianer = styled.div`
  width: 85vw;
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-contente: center;
  align-items: flex-end;
  box-shadow: 0px 2px 6px ${color.boxShadowBtn};
  border-radius: 20px;
  @media ${devices.tabletL} {
    height: 40vh;
  }
  @media ${devices.tabletS} {
    height: 40vh;
  }
  @media ${devices.mobileL} {
    height: 40vh;
  }
`;

export default MapContainer;
