import re

# **************************************************************************************************************
#
#										Class representing a single note
#
# **************************************************************************************************************

class Note:
	def __init__(self,note,semitoneAdjustment = 0):
		note = note.upper().strip()
		if note != '&':
			m = re.match("^([A-G])([/#]?)([1-9])$",note)
			assert m is not None,"Bad note definition ("+note+")"
			self.noteList = [ "C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]
			self.noteIndex = self.noteList.index(note[:-1])
			self.noteIndex += (int(note[-1])-1) * 12
			self.noteIndex += semitoneAdjustment
		else:
			self.noteIndex = None
		self.mbLength = 1000

	def getIndex(self):
		return self.noteIndex

	def getName(self):
		if self.noteIndex is None:
			return "&"
		else:
			return self.noteList[self.noteIndex%12] + str(int(self.noteIndex/12)+1)

	def getLength(self):
		return self.mbLength
		
	def bend(self):
		self.noteIndex -= 1
		assert self.noteIndex > 0,"Bent too far"

	def adjust(self,adjuster):
		adjuster = adjuster.lower()
		if adjuster == "\\":
			self.mbLength = int(self.mbLength / 2)
		elif adjuster == 'o':
			self.mbLength += 1000
		elif adjuster == '.':
			self.mbLength = int(self.mbLength * 3 / 2)
		else:
			assert "Unknown adjuster ["+adjuster+"]"

	def isAdjuster(self,adjuster):
		return "oO\\.".find(adjuster) >= 0

	def render(self):
		length = chr(int(self.mbLength/250+0.5)+ord("a")-1)
		return "{0:2}{1}".format(self.noteIndex if self.noteIndex is not None else 99,length)

# **************************************************************************************************************
#
#									Class representing a Diatonic Harmonica.
#
# **************************************************************************************************************

class DiatonicHarmonica:
	def __init__(self,semitoneAdjustment = 0):
		self.blowNotes = "C4 E4 G4 C5 E5 G5 C6 E6 G6 C7".split(" ")
		self.drawNotes = "D4 G4 B4 D5 F5 A5 B5 D6 F6 A6".split(" ")
		for i in range(0,10):
			self.blowNotes[i] = Note(self.blowNotes[i],semitoneAdjustment)
			self.drawNotes[i] = Note(self.drawNotes[i],semitoneAdjustment)
		self.blowNotes.insert(0,None)
		self.drawNotes.insert(0,None)

	def getBlow(self,n):
		assert n>= 1 and n <= 10,"Bad hole "+str(n)
		return self.blowNotes[n]

	def getDraw(self,n):
		assert n>= 1 and n <= 10,"Bad hole "+str(n)
		return self.drawNotes[n]

	def show(self):
		self._showHoles(self.blowNotes)
		self._showHoles(self.drawNotes)

	def _showHoles(self,notes):
		notes = [(x.getName()+"  ")[:3] for x in notes[1:]]
		notes = "|".join([" "+x+" " for x in notes])
		print("["+notes+"]")

	def getKey(self):
		return "C"
		
# **************************************************************************************************************
#
#									Class representing a Bar of Music
#
# **************************************************************************************************************

class Bar:
	def __init__(self,contents,instrument):
		self.instrument = instrument
		self.noteList = []
		contents = contents.lower().strip()
		for entry in contents.split(" "):
			if entry != "":
				self.addNote(entry)

	def addNote(self,noteDesc):
		if noteDesc[0] == '&':
			note = Note("&")
			postProcess = noteDesc[1:].strip()
		else:
			m = re.match("^([/-]?[0-9]+)(.*)$",noteDesc)
			assert m is not None,"Illegal note definition ["+noteDesc+"]"
			hole = int(m.group(1))
			postProcess = m.group(2).strip()
			assert abs(hole) <= 10 and hole != 0,"Bad harmonica hole reference ["+noteDesc+"]"
			note = self.instrument.getDraw(-hole) if hole < 0 else self.instrument.getBlow(hole)
			note = Note(note.getName())			# clone
		
		postProcess = postProcess.replace("b","<").replace("'","<")
		for c in postProcess:
			if c == '<':
				note.bend()
			else:
				note.adjust(c)
		self.noteList.append(note)
		#print(note.getName(),note.getLength(),postProcess)

	def checkLength(self,beats):
		n = 0
		for note in self.noteList:
			n += note.getLength()
		return n <= beats * 1000

	def render(self):
		render = ""
		for note in self.noteList:
			render = render + note.render()
		return render

dchm = DiatonicHarmonica()
dchm.show()
bar = Bar(" -4o   -4  5\\  6\\ ",dchm)
print(bar.checkLength(4))
print(bar.render())
