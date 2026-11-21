require 'auto_timezone/version'
require 'auto_timezone/config'

raise 'Invalid gem version' unless /\A\d+\.\d+\.\d+\z/.match?(AutoTimezone::VERSION)

config = AutoTimezone.config
raise 'Missing default timezone preferences' unless config.preferred_timezones == %w(US/Eastern US/Central US/Mountain US/Pacific)

AutoTimezone.configure do |options|
  options.preferred_timezones = %w(UTC US/Eastern)
  options.default_timezone { 'UTC' }
end

raise 'Timezone preferences not configurable' unless AutoTimezone.config.preferred_timezones == %w(UTC US/Eastern)
raise 'Default timezone block not retained' unless AutoTimezone.config.default_timezone_block.call == 'UTC'

puts 'AutoTimezone configuration smoke test passed'
