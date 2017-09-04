import re,sys

# **************************************************************************************************************
#
#					Class representing a single breath event (e.g. blow or draw event or chards)
#
# **************************************************************************************************************

class HarpEvent:
	def __init__(self,desc):
		self.isBlow = True
		self.length = 4
		self.holes = []

		l1 = len(desc) 																# calculate how many bends
		desc = desc.replace("'","").replace("b","").replace("<","")					# remove bends
		self.modifiers = -abs(l1-len(desc))											# modifier is how many removed

		if desc[0] == '+' or desc[0] == '-':										# leading + or -
			self.isBlow = desc[0] == '+'
			desc = desc[1:]

		if desc[0] == '[':															# [x,x,x] chord
			m = re.match("^\\[([0-9\\,]+)\\](.*)",desc)
			assert m is not None,"Syntax of chord "+desc
			for hole in m.group(1).split(","):
				self.addHole(int(hole))
			desc = m.group(2)

		elif desc[0] == '&':														# rest.
			desc = desc[1:]
		else:
			m = re.match("^([0-9]+)(.*)",desc)
			assert m is not None,"Missing holes in "+desc
			self.addHole(int(m.group(1)))
			desc = m.group(2)

		for mod in desc:
			assert mod in HarpEvent.MODIFIERS,"Unknown length modifier "+mod
			self.length += HarpEvent.MODIFIERS[mod]

	def addHole(self,hole):
		assert hole >= 1 and hole <= 10,"Bad harmonica hole "+str(hole)
		self.holes.append(hole)

	def getLength(self):	
		return self.length / 4

	def render(self):
		render = ">" if self.isBlow else "<"
		render = render + "".join([str(n-1) for n in self.holes])
		if self.modifiers < 0:
			render = render + ("-") * (-self.modifiers)
		if self.modifiers > 0:
			render = render + ("+") * self.modifiers
		render = render + chr(self.length+ord('a')-1)
		return render

HarpEvent.MODIFIERS = { "o":4,"-":-2,"=":-3,".":2 }									# time modifiers

# **************************************************************************************************************
#
#									Class representing a Bar of Music
#
# **************************************************************************************************************

class Bar:
	def __init__(self,contents):
		self.eventList = []
		contents = contents.lower().strip()
		for entry in contents.split(" "):
			if entry != "":
				self.addEvent(entry)

	def addEvent(self,evDesc):
		self.eventList.append(HarpEvent(evDesc))

	def checkLength(self,beats):
		n = 0
		for event in self.eventList:
			n += event.getLength()
		return n <= beats

	def render(self):
		render = ";".join([x.render() for x in self.eventList])
		return render

# **************************************************************************************************************
#
#												Compiler Class
#
# **************************************************************************************************************

class Compiler:

	def version(self):
		return 0.1

	def compile(self,inStream,outStream,key = 'c'):
		self.outStream = outStream
		self.key = key
		self.source = inStream.readlines()
		self.preProcess()
		self.barList = []
		for musicLine in [x for x in self.source if x.find(":=") < 0 and x.strip() != ""]:
			for barDef in musicLine.split("|"):
				bar = Bar(barDef)
				self.barList.append(bar)
				beats = int(self.assignments["beats"])
				assert bar.checkLength(beats),"Bar is too long ["+barDef+"]"
		self.header()
		self.body()
		self.footer()

	def preProcess(self):
		self.source = [x if x.find("#") < 0 else x[:x.find("#")] for x in self.source]
		self.source = [x.strip() for x in self.source]
		self.assignments = { "beats":"4","speed":"100","title":"","composer":"","key":self.key,"harmonica":"diatonic"}
		self.assignments["compiler"] = str(self.version())
		for assign in [x for x in self.source if x.find(":=") > 0]:
			assign = [x.strip().lower() for x in assign.split(":=")]
			assert assign[0] in self.assignments,"Unknown assignment ["+assign[0]+"]"
			self.assignments[assign[0]] = assign[1]

	def header(self):
		self.outStream.write("{\n")
		for k in self.assignments.keys():
			self.outStream.write('    "{0}":"{1}",\n'.format(k,self.assignments[k]))

	def body(self):
		self.outStream.write('    "bars": [\n')
		self.outStream.write(",\n".join(['{1:14}"{0}"'.format(bar.render(),"") for bar in self.barList]))
		self.outStream.write('\n            ]\n')

	def footer(self):
		self.outStream.write("}\n")

if __name__ == '__main__':
	cmpl = Compiler()
	cmpl.compile(open("love_me_do.harp"),open("../app/music.json","w"))
	cmpl.compile(open("love_me_do.harp"),sys.stdout)
