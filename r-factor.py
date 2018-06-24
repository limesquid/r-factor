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
      'component-superclass': self.get_setting('component-superclass'),
      'end-of-line': self.get_setting('end-of-line'),
      'indent': self.get_setting('indent'),
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
