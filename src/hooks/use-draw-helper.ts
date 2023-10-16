import { useTranslation } from 'react-i18next';

export function useDrawHelper() {
  const { t } = useTranslation();
  return {
    draw: `${t('map_contorl_group.draw.draw')}`,
    drawFinish: `${t('map_contorl_group.draw.drawFinish')}`,
    drawContinue: `${t('map_contorl_group.draw.drawContinue')}`,
    pointHover: `${t('map_contorl_group.draw.pontHover')}`,
    lineHover: `${t('map_contorl_group.draw.lineHover')}`,
    polygonHover: `${t('map_contorl_group.draw.lineHover')}`,
    midPointHover: `${t(`map_contorl_group.draw.midPointHover`)}`,
  };
}
