from django import template
from django.templatetags.static import static
from django.utils.html import format_html


register = template.Library()


@register.simple_tag
def script(appname: str, script_name: str, defer=True, module=True):
    """
    Render a `<script>` tag for including a JavaScript file from an app's `scripts/` directory.

    Parameters
    ----------
    appname : str
        The name of the Django app containing the `scripts/` folder inside its static files.
    script_name : str
        The filename of the JavaScript file to include (e.g. "color-scheme.js").
    defer : bool, optional
        If True, includes the `defer` attribute. Default is True.
    module : bool, optional
        If True, includes the `type="module"` attribute. Default is True.

    Returns
    -------
    str
        A formatted HTML `<script>` tag with the specified attributes and file path.

    Examples
    --------
    >>> {% script 'project' 'color-scheme' %}
    <script defer type="module" src="/static/project/scripts/color-scheme.js"></script>
    """
    attrs = []
    if defer:
        attrs.append('defer')
    if module:
        attrs.append('type=module')

    return format_html(
        '<script {} src="{}"></script>',
        ' '.join(attrs),
        static(f'{appname}/scripts/{script_name}.js')
    )


@register.simple_tag
def style(appname: str, style_name: str):
    """
    Render a `<link>` tag to include a CSS stylesheet from an app's `styles/` directory.

    Parameters
    ----------
    appname : str
        The name of the Django app containing the `styles/` folder inside its static files.
    style_name : str
        The name of the CSS file (without the `.css` extension) to include.

    Returns
    -------
    str
        A formatted HTML `<link>` tag pointing to the specified stylesheet.

    Examples
    --------
    >>> {% style 'project' 'theme' %}
    <link rel="stylesheet" href="/static/project/styles/theme.css">
    """

    return format_html(
        '<link rel="stylesheet" href="{}">',
        static(f'{appname}/styles/{style_name}.css')
    )