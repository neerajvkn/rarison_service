from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in rarison_service/__init__.py
from rarison_service import __version__ as version

setup(
	name="rarison_service",
	version=version,
	description="App for rarison service center",
	author="Neeraj",
	author_email="neerajvkn@gmail.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
