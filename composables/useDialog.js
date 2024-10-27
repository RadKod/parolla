import { useContext } from '@nuxtjs/composition-api'
import { Dialog } from 'vant'

export default () => {
  const { i18n } = useContext()

  const openLeaveDialog = ({ confirm, cancel }) => {
    Dialog.confirm({
      title: i18n.t('dialog.leave.title'),
      message: i18n.t('dialog.leave.description'),
      cancelButtonText: i18n.t('general.cancel'),
      confirmButtonText: i18n.t('general.apply')
    })
      .then(() => {
        if (confirm) {
          confirm()
        }
      })
      .catch(() => {
        if (cancel) {
          cancel()
        }
      })
  }

  return {
    openLeaveDialog
  }
}
