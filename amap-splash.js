/* STRA 高德开屏测试 — 仅处理抓包证实的 AOCS 三项配置，不触碰地图/导航/定位。 */
(function () {
  try {
    if (!$response || typeof $response.body !== 'string' || !$response.body) {
      $done({});
      return;
    }
    var payload = JSON.parse($response.body);
    if (!payload || !payload.data || typeof payload.data !== 'object') {
      $done({});
      return;
    }
    var data = payload.data;
    function patchConfig(key, fallback, mutator, version) {
      var entry = data[key];
      if (!entry || typeof entry !== 'object') return false;
      var current;
      try { current = JSON.parse(entry.value); } catch (e) { current = null; }
      if (!current || typeof current !== 'object' || Array.isArray(current)) {
        current = fallback;
      }
      mutator(current);
      entry.status = 1;
      entry.version = version;
      entry.value = JSON.stringify(current);
      return true;
    }
    var changed = false;
    changed = patchConfig('SplashScreenControl', { MaxTimesPerDay: 0, SplashScreenControlMock: 0 }, function (c) {
      c.MaxTimesPerDay = 0;
      c.SplashScreenControlMock = 0;
    }, '67FD961A6C74A194A1F9691C44D7C761') || changed;
    changed = patchConfig('splashscreen', { splash_all_time: 0, show_splash_in_days: 0, times_and_interval_control: {} }, function (c) {
      c.splash_all_time = 0;
      c.show_splash_in_days = 0;
      if (!c.times_and_interval_control || typeof c.times_and_interval_control !== 'object') {
        c.times_and_interval_control = {};
      }
      c.times_and_interval_control.max_times_foreground = 0;
      c.times_and_interval_control.max_times_schema = 0;
    }, 'AD6FCF29F4EE77CB6C7491373EA2925D') || changed;
    changed = patchConfig('splashview_config', { enable: 0 }, function (c) {
      c.enable = 0;
    }, '94FF984EC837D8E3C806F70D3961AE09') || changed;
    $done(changed ? { body: JSON.stringify(payload) } : {});
  } catch (error) {
    /* 解析/结构异常时原样放行，避免影响高德核心功能。 */
    $done({});
  }
})();
