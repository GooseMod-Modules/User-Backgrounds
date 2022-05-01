import Plugin from '@goosemod/plugin';
import { patch } from '@goosemod/patcher';
import * as Webpack from '@goosemod/webpack';
import { React } from '@goosemod/webpack/common';

const UserPopoutContainer = Webpack.find(x => x?.type?.displayName === 'UserPopoutContainer'); // Memo, so within .type, not .default
const UserBanner = Webpack.find(x => x.default?.displayName === 'UserBanner')
const { TextBadge } = goosemod.webpackModules.findByProps('TextBadge');


let database;
(async () => { // Fetch and load DB async
  database = (await (await fetch('https://raw.githubusercontent.com/Discord-Custom-Covers/usrbg/master/dist/usrbg.json')).json()).reduce((acc, x) => { acc[x.uid] = x.img; return acc; }, {})
})();


class Usrbg extends Plugin {
  onImport() {
    this.enqueueUnpatch(patch(UserPopoutContainer, 'type', (_args, res) => { // Patch UserPopoutContainer with fake user.banner so it uses "premium" layout for banner
      const user = res.props.user;
      if (database[user.id]) res.props.user.banner = 'null'; // It loads a formatted CDN url (e.g. example.com/banners/user_id/banner_id) so we can't just put URL here

      return res;
    }));

    this.enqueueUnpatch(patch(UserBanner, 'default', ([ { user } ], res) => { // Patch UserBanner so it actually shows banner
      if (database[user.id]) {
        res.props.style.backgroundImage = 'url("' + database[user.id] + '")';

        res.props.children[0] = React.createElement(TextBadge, {
          color: 'rgba(32, 34, 37, 0.8)',
          className: 'premiumIconWrapper-32h0Ri',
          text: React.createElement('span', { }, 'USRBG')
        });
      }

      return res;
    }));
  }
}

export default new Usrbg();