import type { MenuProps } from 'antd';
import { Button, Dropdown } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconFont } from '../../../constants';
import { LangList } from '../../../locales';
import { useGlobal } from '../../../recoil';
import useStyle from '../styles';

const items: MenuProps['items'] = LangList.map((item) => ({
  key: item.lang,
  label: item.name,
}));

const I18nBtn: React.FC = () => {
  const { i18n } = useTranslation();
  const { locale, setLocale } = useGlobal();
  const styles = useStyle();

  const onLocaleChange: MenuProps['onClick'] = ({ key }) => {
    i18n.changeLanguage(key);
    setLocale(key);
  };

  return (
    <Dropdown
      menu={{
        items,
        onClick: onLocaleChange,
        selectedKeys: [locale],
        selectable: true,
      }}
    >
      <Button
        className={styles.locale}
        icon={<IconFont className={styles.localeIcon} type="icon-in" />}
      />
    </Dropdown>
  );
};

export default I18nBtn;
