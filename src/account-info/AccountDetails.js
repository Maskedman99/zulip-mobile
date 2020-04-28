/* @flow strict-local */
import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';

import type { UserOrBot, Dispatch } from '../types';
import { connect } from '../react-redux';
import { UserAvatar, ComponentList, RawLabel } from '../common';
import { getCurrentRealm, getUserStatusTextForUser } from '../selectors';
import PresenceStatusIndicator from '../common/PresenceStatusIndicator';
import ActivityText from '../title/ActivityText';
import { getAvatarFromUser } from '../utils/avatar';
import { nowInTimeZone } from '../utils/date';
import { IconRobot } from '../common/Icons';
import type { ThemeColors } from '../styles';
import styles, { ThemeContext } from '../styles';

const componentStyles = StyleSheet.create({
  componentListItem: {
    alignItems: 'center',
  },
  statusWrapper: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  statusText: {
    textAlign: 'center',
  },
});

const AVATAR_SIZE = 200;

type SelectorProps = {|
  realm: string,
  userStatusText: string | void,
|};

type Props = $ReadOnly<{|
  user: UserOrBot,

  dispatch: Dispatch,
  ...SelectorProps,
|}>;

class AccountDetails extends PureComponent<Props> {
  static contextType = ThemeContext;
  context: ThemeColors;

  render() {
    const { realm, user, userStatusText } = this.props;

    let localTime: string | null = null;
    // See comments at CrossRealmBot and User at src/api/modelTypes.js.
    if (user.timezone !== '' && user.timezone !== undefined) {
      try {
        localTime = `${nowInTimeZone(user.timezone)} Local time`;
      } catch (err) {
        // The set of timezone names in the tz database is subject to change over
        // time. Handle unrecognized timezones by quietly discarding them.
      }
    }

    return (
      <ComponentList outerSpacing itemStyle={componentStyles.componentListItem}>
        <View>
          <UserAvatar avatarUrl={getAvatarFromUser(user, realm, AVATAR_SIZE)} size={AVATAR_SIZE} />
        </View>
        <View style={componentStyles.statusWrapper}>
          <RawLabel style={[styles.largerText, styles.halfMarginRight]} text={user.full_name} />
          {user.is_bot && <IconRobot size={20} style={{ color: this.context.color }} />}
          <PresenceStatusIndicator email={user.email} hideIfOffline={false} />
        </View>
        {userStatusText !== undefined && (
          <RawLabel style={[styles.largerText, componentStyles.statusText]} text={userStatusText} />
        )}
        <RawLabel style={[styles.largerText, componentStyles.statusText]} text={user.email} />
        <View>
          <ActivityText style={styles.largerText} user={user} />
        </View>
        {localTime !== null && (
          <View>
            <RawLabel style={styles.largerText} text={localTime} />
          </View>
        )}
      </ComponentList>
    );
  }
}

export default connect<SelectorProps, _, _>((state, props) => ({
  realm: getCurrentRealm(state),
  userStatusText: getUserStatusTextForUser(state, props.user.user_id),
}))(AccountDetails);
