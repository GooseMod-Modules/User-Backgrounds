import Plugin from '@goosemod/plugin';
import { patch } from '@goosemod/patcher';
import * as Webpack from '@goosemod/webpack';

const UserPopoutContainer = Webpack.find(x => x?.type?.displayName === 'UserPopoutContainer'); // Memo, so within .type, not .default
const UserBanner = Webpack.find(x => x.default?.displayName === 'UserBanner')

let database;
(async () => { // Fetch and load DB async
  database = (await (await fetch('https://raw.githubusercontent.com/Discord-Custom-Covers/usrbg/master/dist/usrbg.json')).json()).reduce((acc, x) => { acc[x.uid] = x.img; return acc; }, {})
})();


class Usrbg extends Plugin {
  onImport() {
    this.enqueueUnpatch(patch(UserPopoutContainer, 'type', (_args, res) => { // Patch UserPopoutContainer with fake user.banner so it uses "premium" layout for banner
      res.props.user.banner = 'null'; // It loads a formatted CDN url (e.g. example.com/banners/user_id/banner_id) so we can't just put URL here
      return res;
    }));

    this.enqueueUnpatch(patch(UserBanner, 'default', ([ { user } ], res) => { // Patch UserBanner so it actually shows banner
      res.props.style.backgroundImage = 'url("' + database[user.id] + '")';
    }));
  }
}

export default new Usrbg();