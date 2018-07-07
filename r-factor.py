import json
import os
import sublime
import sublime_plugin
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '.'))
from r_factor_utils import node_bridge

BIN_PATH = os.path.join(
  sublime.packages_path(),
  os.path.dirname(os.path.realpath(__file__)),
  'dist',
  'index.js'
)

class BaseCommand(sublime_plugin.TextCommand):
  def run(self, edit):
    selection = self.view.sel()
    region = selection[0]
    selected_text = self.view.substr(region)
    if len(selected_text) == 0:
      region = sublime.Region(0, self.view.size())
      selected_text = self.view.substr(region)
    stdout = self.execute(selected_text, self.refactoring_name)
    if stdout != selected_text:
      self.view.replace(edit, region, stdout)

  def is_enabled(self):
    return True

  def execute(self, data, refactoring_name):
    try:
      return node_bridge(data, BIN_PATH, [
        '-r', refactoring_name,
        '-s', json.dumps(self.get_settings())
      ])
    except Exception as e:
      return str(e)

  def get_settings(self):
    return {
      'component-name-collision-pattern': self.get_setting('component-name-collision-pattern'),
      'component-superclass': self.get_setting('component-superclass'),
      'default-component-name': self.get_setting('default-component-name'),
      'default-hoc-component-name': self.get_setting('default-hoc-component-name'),
      'end-of-line': self.get_setting('end-of-line'),
      'functional-component-type': self.get_setting('functional-component-type'),
      'indent': self.get_setting('indent'),
      'map-dispatch-to-props-name': self.get_setting('map-dispatch-to-props-name'),
      'map-state-to-props-name': self.get_setting('map-state-to-props-name'),
      'map-to-dispatch-prefer-object': self.get_setting('map-to-dispatch-prefer-object'),
      'map-to-state-prefer-one-line': self.get_setting('map-to-state-prefer-one-line'),
      'merge-props-name': self.get_setting('merge-props-name'),
      'modules-order': self.get_setting('modules-order'),
      'quotes': self.get_setting('quotes'),
      'semicolons': self.get_setting('semicolons')
    }

  def get_setting(self, key):
    settings = self.view.settings().get('r-factor')
    if settings is None:
      settings = sublime.load_settings('r-factor.sublime-settings')
    return settings.get(key)

class AddClassnameCommand(BaseCommand):
  def __init__(self, arg):
    super(AddClassnameCommand, self).__init__(arg)
    self.refactoring_name = 'add-classname'


class ConnectComponent(BaseCommand):
  def __init__(self, arg):
    super(ConnectComponent, self).__init__(arg)
    self.refactoring_name = 'connect-component'


class ConnectComponentWithState(BaseCommand):
  def __init__(self, arg):
    super(ConnectComponentWithState, self).__init__(arg)
    self.refactoring_name = 'connect-component-with-state'


class ConnectComponentWithDispatch(BaseCommand):
  def __init__(self, arg):
    super(ConnectComponentWithDispatch, self).__init__(arg)
    self.refactoring_name = 'connect-component-with-dispatch'


class ConnectComponentWithMergeProps(BaseCommand):
  def __init__(self, arg):
    super(ConnectComponentWithMergeProps, self).__init__(arg)
    self.refactoring_name = 'connect-component-with-merge-props'


class ConvertToClassComponentCommand(BaseCommand):
  def __init__(self, arg):
    super(ConvertToClassComponentCommand, self).__init__(arg)
    self.refactoring_name = 'convert-to-class-component'


class ConvertToArrowComponentCommand(BaseCommand):
  def __init__(self, arg):
    super(ConvertToArrowComponentCommand, self).__init__(arg)
    self.refactoring_name = 'convert-to-arrow-component'


class ConvertToFunctionComponentCommand(BaseCommand):
  def __init__(self, arg):
    super(ConvertToFunctionComponentCommand, self).__init__(arg)
    self.refactoring_name = 'convert-to-function-component'


class DisconnectComponent(BaseCommand):
  def __init__(self, arg):
    super(DisconnectComponent, self).__init__(arg)
    self.refactoring_name = 'disconnect-component'


class DisconnectComponentFromState(BaseCommand):
  def __init__(self, arg):
    super(DisconnectComponentFromState, self).__init__(arg)
    self.refactoring_name = 'disconnect-component-from-state'


class DisconnectComponentFromDispatch(BaseCommand):
  def __init__(self, arg):
    super(DisconnectComponentFromDispatch, self).__init__(arg)
    self.refactoring_name = 'disconnect-component-from-dispatch'


class DisconnectComponentFromMergeProps(BaseCommand):
  def __init__(self, arg):
    super(DisconnectComponentFromMergeProps, self).__init__(arg)
    self.refactoring_name = 'disconnect-component-from-merge-props'


class GeneratePropTypesCommand(BaseCommand):
  def __init__(self, arg):
    super(GeneratePropTypesCommand, self).__init__(arg)
    self.refactoring_name = 'generate-prop-types'


class MoveDefaultPropsOutOfClass(BaseCommand):
  def __init__(self, arg):
    super(MoveDefaultPropsOutOfClass, self).__init__(arg)
    self.refactoring_name = 'move-default-props-out-of-class'


class MoveDefaultPropsToClass(BaseCommand):
  def __init__(self, arg):
    super(MoveDefaultPropsToClass, self).__init__(arg)
    self.refactoring_name = 'move-default-props-to-class'


class MovePropTypesOutOfClass(BaseCommand):
  def __init__(self, arg):
    super(MovePropTypesOutOfClass, self).__init__(arg)
    self.refactoring_name = 'move-prop-types-out-of-class'


class MovePropTypesToClass(BaseCommand):
  def __init__(self, arg):
    super(MovePropTypesToClass, self).__init__(arg)
    self.refactoring_name = 'move-prop-types-to-class'


class SortAttributesCommand(BaseCommand):
  def __init__(self, arg):
    super(SortAttributesCommand, self).__init__(arg)
    self.refactoring_name = 'sort-attributes'


class SortImportsCommand(BaseCommand):
  def __init__(self, arg):
    super(SortImportsCommand, self).__init__(arg)
    self.refactoring_name = 'sort-imports'


class ToggleComponentType(BaseCommand):
  def __init__(self, arg):
    super(ToggleComponentType, self).__init__(arg)
    self.refactoring_name = 'toggle-component-type'
