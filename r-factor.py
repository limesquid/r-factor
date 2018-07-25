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
    NODE_BIN = self.get_setting('NODE_BIN')
    try:
      return node_bridge(data, NODE_BIN, BIN_PATH, [
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
      'map-dispatch-to-props-prefer-object': self.get_setting('map-dispatch-to-props-prefer-object'),
      'map-state-to-props-prefer-one-line': self.get_setting('map-state-to-props-prefer-one-line'),
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

class AddClassname(BaseCommand):
  def __init__(self, arg):
    super(AddClassname, self).__init__(arg)
    self.refactoring_name = 'add-classname'


class Connect(BaseCommand):
  def __init__(self, arg):
    super(Connect, self).__init__(arg)
    self.refactoring_name = 'connect'


class ConnectMapStateToProps(BaseCommand):
  def __init__(self, arg):
    super(ConnectMapStateToProps, self).__init__(arg)
    self.refactoring_name = 'connect-map-state-to-props'


class ConnectMapDispatchToProps(BaseCommand):
  def __init__(self, arg):
    super(ConnectMapDispatchToProps, self).__init__(arg)
    self.refactoring_name = 'connect-map-dispatch-to-props'


class ConnectMergeProps(BaseCommand):
  def __init__(self, arg):
    super(ConnectMergeProps, self).__init__(arg)
    self.refactoring_name = 'connect-merge-props'


class ConvertToClassComponent(BaseCommand):
  def __init__(self, arg):
    super(ConvertToClassComponent, self).__init__(arg)
    self.refactoring_name = 'convert-to-class-component'


class ConvertToArrowComponent(BaseCommand):
  def __init__(self, arg):
    super(ConvertToArrowComponent, self).__init__(arg)
    self.refactoring_name = 'convert-to-arrow-component'


class ConvertToFunctionComponent(BaseCommand):
  def __init__(self, arg):
    super(ConvertToFunctionComponent, self).__init__(arg)
    self.refactoring_name = 'convert-to-function-component'


class Disconnect(BaseCommand):
  def __init__(self, arg):
    super(Disconnect, self).__init__(arg)
    self.refactoring_name = 'disconnect'


class DisconnectMapStateToProps(BaseCommand):
  def __init__(self, arg):
    super(DisconnectMapStateToProps, self).__init__(arg)
    self.refactoring_name = 'disconnect-map-state-to-props'


class DisconnectMapDispatchToProps(BaseCommand):
  def __init__(self, arg):
    super(DisconnectMapDispatchToProps, self).__init__(arg)
    self.refactoring_name = 'disconnect-map-dispatch-to-props'


class DisconnectMergeProps(BaseCommand):
  def __init__(self, arg):
    super(DisconnectMergeProps, self).__init__(arg)
    self.refactoring_name = 'disconnect-merge-props'


class GeneratePropTypes(BaseCommand):
  def __init__(self, arg):
    super(GeneratePropTypes, self).__init__(arg)
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


class SortAttributes(BaseCommand):
  def __init__(self, arg):
    super(SortAttributes, self).__init__(arg)
    self.refactoring_name = 'sort-attributes'


class SortImports(BaseCommand):
  def __init__(self, arg):
    super(SortImports, self).__init__(arg)
    self.refactoring_name = 'sort-imports'


class ToggleComponentType(BaseCommand):
  def __init__(self, arg):
    super(ToggleComponentType, self).__init__(arg)
    self.refactoring_name = 'toggle-component-type'


class ToggleWithRouterHoc(BaseCommand):
  def __init__(self, arg):
    super(ToggleWithRouterHoc, self).__init__(arg)
    self.refactoring_name = 'toggle-with-router-hoc'
